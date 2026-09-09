"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useViewerStore, ViewerFile, ModelStats } from "@/app/store/viewer-store";

interface ModelRendererProps {
  file: ViewerFile;
}

// Procedural sample model generator for instant zero-network testing
function createProceduralSampleScene(type: "drone" | "mech"): THREE.Group {
  const group = new THREE.Group();

  if (type === "mech") {
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.3,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    const ringGeo = new THREE.TorusGeometry(1.8, 0.08, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.9,
    });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    const ring3 = new THREE.Mesh(ringGeo, ringMat);
    ring3.rotation.z = Math.PI / 4;
    group.add(ring3);

    const satelliteGeo = new THREE.OctahedronGeometry(0.3, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2,
      metalness: 0.7,
    });

    [
      [2.2, 0, 0],
      [-2.2, 0, 0],
      [0, 2.2, 0],
      [0, -2.2, 0],
      [0, 0, 2.2],
      [0, 0, -2.2],
    ].forEach((pos) => {
      const sat = new THREE.Mesh(satelliteGeo, satMat);
      sat.position.set(pos[0], pos[1], pos[2]);
      group.add(sat);
    });
  } else {
    // Aerospace Scout Drone
    const bodyGeo = new THREE.ConeGeometry(0.7, 2.4, 6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.85,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.x = Math.PI / 2;
    group.add(bodyMesh);

    const canopyGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.9,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.3, 0.2);
    canopy.scale.set(0.7, 0.6, 1.4);
    group.add(canopy);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.2, -0.9);
    wingShape.lineTo(2.0, -1.3);
    wingShape.lineTo(0, -0.6);
    wingShape.closePath();

    const extrudeSettings = {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.7,
    });

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.position.set(0.3, 0, -0.2);
    group.add(rightWing);

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.rotation.x = Math.PI / 2;
    leftWing.rotation.y = Math.PI;
    leftWing.position.set(-0.3, 0, -0.2);
    group.add(leftWing);

    const thrusterGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.8, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });

    const rightEngine = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.position.set(0.6, -0.1, -1.0);
    group.add(rightEngine);

    const leftEngine = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.position.set(-0.6, -0.1, -1.0);
    group.add(leftEngine);

    const nozzleGeo = new THREE.CircleGeometry(0.16, 16);
    const rightNozzle = new THREE.Mesh(nozzleGeo, glowMat);
    rightNozzle.position.set(0.6, -0.1, -1.41);
    group.add(rightNozzle);

    const leftNozzle = new THREE.Mesh(nozzleGeo, glowMat);
    leftNozzle.position.set(-0.6, -0.1, -1.41);
    group.add(leftNozzle);
  }

  return group;
}

function normalizeAndStats(
  object: THREE.Object3D,
  onStats: (stats: ModelStats) => void
) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0 && isFinite(maxDim)) {
    const targetScale = 2.4 / maxDim;
    object.scale.setScalar(targetScale);
    object.updateMatrixWorld(true);

    const updatedBox = new THREE.Box3().setFromObject(object);
    const center = updatedBox.getCenter(new THREE.Vector3());
    object.position.x -= center.x;
    object.position.z -= center.z;
    object.position.y -= updatedBox.min.y;
    object.updateMatrixWorld(true);
  }

  let vertices = 0;
  let triangles = 0;
  let meshes = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes++;
      child.castShadow = true;
      child.receiveShadow = true;

      const geo = child.geometry;
      if (geo) {
        if (geo.attributes?.position) {
          vertices += geo.attributes.position.count;
        }
        if (geo.index) {
          triangles += geo.index.count / 3;
        } else if (geo.attributes?.position) {
          triangles += geo.attributes.position.count / 3;
        }
      }
    }
  });

  onStats({
    vertices: Math.round(vertices),
    triangles: Math.round(triangles),
    meshes,
  });
}

function applyWireframe(object: THREE.Object3D, wireframe: boolean) {
  object.traverse((child) => {
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
}

export function ModelRenderer({ file }: ModelRendererProps) {
  const wireframe = useViewerStore((s) => s.wireframe);
  const setStats = useViewerStore((s) => s.setStats);
  const setError = useViewerStore((s) => s.setError);
  const setLoading = useViewerStore((s) => s.setLoading);
  const [modelObject, setModelObject] = useState<THREE.Object3D | null>(null);
  const currentFileKeyRef = useRef<string>("");

  useEffect(() => {
    const fileKey = `${file.name}-${file.size}-${file.url}`;
    if (currentFileKeyRef.current === fileKey) {
      return;
    }
    currentFileKeyRef.current = fileKey;

    let isSubscribed = true;

    const handleLoadedObject = (obj: THREE.Object3D) => {
      if (!isSubscribed) return;
      normalizeAndStats(obj, (stats) => {
        if (isSubscribed) setStats(stats);
      });
      applyWireframe(obj, wireframe);
      setModelObject(obj);
      setLoading(false);
    };

    const handleLoadError = (err: unknown) => {
      if (!isSubscribed) return;
      console.error(`Error loading model ${file.name}:`, err);
      const msg =
        err instanceof Error ? err.message : `Failed to parse ${file.name}`;
      setError(msg);
      setLoading(false);
    };

    try {
      if (file.format === "sample") {
        const type = file.name.includes("mech") ? "mech" : "drone";
        const sampleGroup = createProceduralSampleScene(type);
        handleLoadedObject(sampleGroup);
      } else if (file.format === "glb" || file.format === "gltf") {
        const loader = new GLTFLoader();

        if (file.buffer) {
          loader.parse(
            file.buffer,
            "",
            (gltf) => {
              handleLoadedObject(gltf.scene);
            },
            handleLoadError
          );
        } else {
          loader.load(
            file.url,
            (gltf) => {
              handleLoadedObject(gltf.scene);
            },
            undefined,
            handleLoadError
          );
        }
      } else if (file.format === "obj") {
        const loader = new OBJLoader();
        if (file.buffer) {
          const text = new TextDecoder().decode(file.buffer);
          const obj = loader.parse(text);
          handleLoadedObject(obj);
        } else {
          loader.load(file.url, handleLoadedObject, undefined, handleLoadError);
        }
      } else if (file.format === "stl") {
        const loader = new STLLoader();
        const processGeometry = (geometry: THREE.BufferGeometry) => {
          geometry.computeVertexNormals();
          const mat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.35,
            metalness: 0.25,
          });
          const mesh = new THREE.Mesh(geometry, mat);
          const group = new THREE.Group();
          group.add(mesh);
          handleLoadedObject(group);
        };

        if (file.buffer) {
          processGeometry(loader.parse(file.buffer));
        } else {
          loader.load(file.url, processGeometry, undefined, handleLoadError);
        }
      } else if (file.format === "ply") {
        const loader = new PLYLoader();
        const processGeometry = (geometry: THREE.BufferGeometry) => {
          geometry.computeVertexNormals();
          const hasColors = !!geometry.attributes.color;
          const mat = new THREE.MeshStandardMaterial({
            color: hasColors ? 0xffffff : 0x818cf8,
            vertexColors: hasColors,
            roughness: 0.4,
            metalness: 0.3,
          });
          const mesh = new THREE.Mesh(geometry, mat);
          const group = new THREE.Group();
          group.add(mesh);
          handleLoadedObject(group);
        };

        if (file.buffer) {
          processGeometry(loader.parse(file.buffer));
        } else {
          loader.load(file.url, processGeometry, undefined, handleLoadError);
        }
      } else if (file.format === "fbx") {
        const loader = new FBXLoader();
        if (file.buffer) {
          const fbx = loader.parse(file.buffer, "");
          handleLoadedObject(fbx);
        } else {
          loader.load(file.url, handleLoadedObject, undefined, handleLoadError);
        }
      } else {
        handleLoadError(new Error(`Format .${file.format} is not supported.`));
      }
    } catch (err) {
      handleLoadError(err);
    }

    return () => {
      isSubscribed = false;
    };
  }, [file, setStats, setError, setLoading, wireframe]);

  // Wireframe updates without reloading geometry
  useEffect(() => {
    if (modelObject) {
      applyWireframe(modelObject, wireframe);
    }
  }, [wireframe, modelObject]);

  if (!modelObject) {
    return null;
  }

  return <primitive object={modelObject} />;
}
