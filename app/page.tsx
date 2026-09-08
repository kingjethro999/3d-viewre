"use client";

import { Suspense, useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  useGLTF,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Model Component ─────────────────────────────────────────────────────────

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Compute bounding box to normalize the model size
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim; // normalize so the model fits nicely
    scene.scale.setScalar(scale);

    // Recenter after scaling
    const newBox = new THREE.Box3().setFromObject(scene);
    const center = newBox.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.position.y -= newBox.min.y; // sit on the ground
  }, [scene]);

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function WireframeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3l4 4-4 4" />
      <path d="M20 7H4" />
      <path d="M8 21l-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function GLBViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const controlsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleFile = useCallback((file: File) => {
    if (
      !file.name.toLowerCase().endsWith(".glb") &&
      !file.name.toLowerCase().endsWith(".gltf")
    ) {
      setError("Please upload a .glb or .gltf file");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Revoke previous URL
    setModelUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    const url = URL.createObjectURL(file);

    // Small delay to show the loading state
    setTimeout(() => {
      setModelUrl(url);
      setIsLoading(false);
      setShowHelp(true);
    }, 500);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleNewFile = () => {
    if (modelUrl) URL.revokeObjectURL(modelUrl);
    setModelUrl(null);
    setFileName("");
    setFileSize("");
  };

  // Hide help after some interaction
  useEffect(() => {
    if (!showHelp) return;
    const timer = setTimeout(() => setShowHelp(false), 8000);
    return () => clearTimeout(timer);
  }, [showHelp, modelUrl]);

  // Apply wireframe to all meshes when toggled
  useEffect(() => {
    if (!modelUrl) return;
    // We'll use a short delay to ensure the scene is loaded
    const timer = setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      // This is handled via the r3f scene traversal below
    }, 100);
    return () => clearTimeout(timer);
  }, [wireframe, modelUrl]);

  // ─── Upload Screen ──────────────────────────────────────────────────────────

  if (!modelUrl && !isLoading) {
    return (
      <div className="upload-zone">
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleInputChange}
          style={{ display: "none" }}
          id="file-upload-input"
        />

        <div className="brand-title">
          <span>GLB Viewer</span>
        </div>

        <div
          className={`upload-card ${isDragOver ? "drag-over" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          id="upload-drop-zone"
        >
          <div className="upload-icon">
            <UploadIcon />
          </div>
          <h1 className="upload-title">Drop your 3D model here</h1>
          <p className="upload-subtitle">
            Drag & drop a GLB or GLTF file to view it in 3D
            <br />
            with full orbit controls and zoom
          </p>
          <button
            className="upload-btn"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            id="browse-files-btn"
          >
            <UploadIcon />
            Browse Files
          </button>
          <p className="upload-hint">Supports .glb and .gltf formats</p>
        </div>

        {error && (
          <div className="error-toast" id="error-toast">
            {error}
          </div>
        )}
      </div>
    );
  }

  // ─── Viewer Screen ──────────────────────────────────────────────────────────

  return (
    <div className="viewer-container page-enter">
      {/* File info badge */}
      <div className="file-info" id="file-info-badge">
        <div className="file-info-icon">
          <CubeIcon />
        </div>
        <div>
          <div className="file-info-name">{fileName}</div>
          <div className="file-info-size">{fileSize}</div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay" id="loading-overlay">
          <div className="loading-spinner" />
          <div className="loading-text">Loading model…</div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="canvas-wrapper" id="canvas-wrapper">
        <Canvas
          camera={{ position: [3, 2, 5], fov: 45 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          shadows
        >
          <color attach="background" args={["#0a0a0f"]} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-3, 4, -5]} intensity={0.4} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Model */}
          {modelUrl && (
            <Suspense fallback={null}>
              <Center>
                <ModelWithWireframe url={modelUrl} wireframe={wireframe} />
              </Center>
            </Suspense>
          )}

          {/* Ground */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Grid */}
          {showGrid && (
            <Grid
              position={[0, -0.01, 0]}
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#1a1a2e"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#2a2a4e"
              fadeDistance={15}
              fadeStrength={1}
              infiniteGrid
            />
          )}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={0.5}
            maxDistance={50}
            enablePan
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* Controls help */}
      <div
        className={`controls-help ${!showHelp ? "hidden" : ""}`}
        id="controls-help"
      >
        <div className="control-hint">
          <span className="control-key">LMB</span> Rotate
        </div>
        <div className="control-hint">
          <span className="control-key">Scroll</span> Zoom
        </div>
        <div className="control-hint">
          <span className="control-key">RMB</span> Pan
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar" id="viewer-toolbar">
        <button
          className="toolbar-btn"
          onClick={resetCamera}
          data-tooltip="Reset Camera"
          id="btn-reset-camera"
        >
          <ResetIcon />
        </button>

        <button
          className={`toolbar-btn ${showGrid ? "active" : ""}`}
          onClick={() => setShowGrid(!showGrid)}
          data-tooltip="Toggle Grid"
          id="btn-toggle-grid"
        >
          <GridIcon />
        </button>

        <button
          className={`toolbar-btn ${wireframe ? "active" : ""}`}
          onClick={() => setWireframe(!wireframe)}
          data-tooltip="Wireframe"
          id="btn-wireframe"
        >
          <WireframeIcon />
        </button>

        <div className="toolbar-divider" />

        <button
          className="toolbar-btn"
          onClick={toggleFullscreen}
          data-tooltip="Fullscreen"
          id="btn-fullscreen"
        >
          <FullscreenIcon />
        </button>

        <div className="toolbar-divider" />

        <button
          className="toolbar-btn"
          onClick={handleNewFile}
          data-tooltip="Open New File"
          id="btn-new-file"
        >
          <SwapIcon />
        </button>
      </div>

      {error && (
        <div className="error-toast" id="error-toast">
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Model with wireframe toggle ─────────────────────────────────────────────

function ModelWithWireframe({
  url,
  wireframe,
}: {
  url: string;
  wireframe: boolean;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Normalize model size
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    const newBox = new THREE.Box3().setFromObject(scene);
    const center = newBox.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.position.y -= newBox.min.y;
  }, [scene]);

  // Apply wireframe mode
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material) => {
            if ("wireframe" in mat) {
              (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
            }
          });
        } else if ("wireframe" in child.material) {
          (child.material as THREE.MeshStandardMaterial).wireframe = wireframe;
        }
      }
    });
  }, [wireframe, scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
