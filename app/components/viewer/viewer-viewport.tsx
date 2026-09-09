"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import {
  useViewerStore,
  LightingPreset,
} from "@/app/store/viewer-store";
import { ModelRenderer } from "./model-renderer";
import { ModelInfoHeader } from "./model-info-header";
import { ViewerToolbar } from "./viewer-toolbar";
import { Loader2, AlertCircle, Eye } from "lucide-react";

function SceneLighting({ preset }: { preset: LightingPreset }) {
  switch (preset) {
    case "studio":
      return (
        <>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />
          <directionalLight position={[0, -5, 0]} intensity={0.3} />
        </>
      );
    case "sunset":
      return (
        <>
          <ambientLight intensity={0.4} color="#fde047" />
          <directionalLight
            position={[8, 4, 3]}
            intensity={2.0}
            color="#fb923c"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-4, 2, -4]}
            intensity={0.6}
            color="#818cf8"
          />
        </>
      );
    case "night":
      return (
        <>
          <ambientLight intensity={0.25} color="#38bdf8" />
          <directionalLight
            position={[3, 8, 4]}
            intensity={1.2}
            color="#60a5fa"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.5}
            color="#a855f7"
          />
        </>
      );
    case "city":
    default:
      return (
        <>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 4, -5]} intensity={0.7} />
          <directionalLight position={[0, 6, -6]} intensity={0.4} />
        </>
      );
  }
}

function OrbitController() {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { autoRotate, cameraResetTrigger } = useViewerStore();

  useEffect(() => {
    if (cameraResetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [cameraResetTrigger]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 1.1, 0]}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.4}
      maxDistance={60}
      enablePan
      autoRotate={autoRotate}
      autoRotateSpeed={2.0}
      maxPolarAngle={Math.PI / 1.7}
    />
  );
}

export function ViewerViewport() {
  const {
    file,
    showGrid,
    lightingPreset,
    isLoading,
    loadingText,
    error,
    showControlsHint,
    setShowControlsHint,
  } = useViewerStore();

  // Auto-hide controls hint after 8 seconds
  useEffect(() => {
    if (!showControlsHint) return;
    const timer = setTimeout(() => setShowControlsHint(false), 9000);
    return () => clearTimeout(timer);
  }, [showControlsHint, setShowControlsHint]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#090a0f] overflow-hidden select-none">
      {/* Top Model Info Header */}
      <ModelInfoHeader />

      {/* 3D Canvas */}
      <div className="w-full h-full absolute inset-0" id="threejs-canvas-wrapper" style={{ width: "100%", height: "100%" }}>
        <Canvas
          camera={{ position: [3.2, 2.4, 4.5], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          shadows
        >
          {/* Solid deep slate background */}
          <color attach="background" args={["#090a0f"]} />

          {/* Lighting */}
          <SceneLighting preset={lightingPreset} />

          {/* 3D Model */}
          {file && <ModelRenderer file={file} />}

          {/* Ground Soft Shadows */}
          <ContactShadows
            position={[0, -0.005, 0]}
            opacity={0.45}
            scale={12}
            blur={2.2}
            far={5}
          />

          {/* Ground Grid */}
          {showGrid && (
            <Grid
              position={[0, -0.01, 0]}
              args={[24, 24]}
              cellSize={0.5}
              cellThickness={0.6}
              cellColor="#1c202c"
              sectionSize={2.5}
              sectionThickness={1.2}
              sectionColor="#272d3e"
              fadeDistance={20}
              fadeStrength={1.2}
              infiniteGrid
            />
          )}

          {/* Camera Orbit Controls */}
          <OrbitController />
        </Canvas>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#090a0f]/85 backdrop-blur-sm">
          <Loader2
            size={40}
            strokeWidth={2}
            className="animate-spin text-[#6366f1] mb-3"
          />
          <p className="text-sm font-semibold text-[#f8fafc]">{loadingText}</p>
          <p className="text-xs text-[#64748b] mt-1">Parsing 3D buffer structures</p>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div
          className="fixed top-5 right-5 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1c1214] border border-[#ef4444]/40 text-[#ef4444] text-xs font-medium shadow-2xl animate-fade-in"
          role="alert"
          id="error-toast"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls Hint Floating Bar */}
      {showControlsHint && (
        <div
          className="fixed bottom-22 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-4 px-4 py-2 rounded-lg bg-[#11131a]/85 backdrop-blur-md border border-[#272d3e] text-xs text-[#94a3b8] animate-fade-in"
          id="viewport-controls-hint"
        >
          <div className="flex items-center gap-1.5">
            <kbd>LMB</kbd> <span>Rotate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd>Scroll</kbd> <span>Zoom</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd>RMB</kbd> <span>Pan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd>W</kbd> <span>Wireframe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd>Space</kbd> <span>Spin</span>
          </div>
        </div>
      )}

      {/* Bottom Viewer Toolbar */}
      <ViewerToolbar />
    </div>
  );
}
