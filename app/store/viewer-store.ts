"use client";

import { create } from "zustand";

export type SupportedFormat =
  | "glb"
  | "gltf"
  | "obj"
  | "stl"
  | "fbx"
  | "ply"
  | "sample";

export interface ViewerFile {
  name: string;
  size: number;
  url: string;
  format: SupportedFormat;
  buffer?: ArrayBuffer;
  rawFile?: File;
}

export interface ModelStats {
  vertices: number;
  triangles: number;
  meshes: number;
}

export type LightingPreset = "city" | "studio" | "sunset" | "dawn" | "night";

export const SUPPORTED_EXTENSIONS: SupportedFormat[] = [
  "glb",
  "gltf",
  "obj",
  "stl",
  "fbx",
  "ply",
];

export const ACCEPTED_EXTENSIONS_STRING =
  ".glb,.gltf,.obj,.stl,.ply,.fbx";

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function isSupported(filename: string): boolean {
  const ext = getFileExtension(filename);
  return SUPPORTED_EXTENSIONS.includes(ext as SupportedFormat);
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

interface ViewerState {
  // Navigation & view
  currentView: "landing" | "viewer";
  setView: (view: "landing" | "viewer") => void;

  // File
  file: ViewerFile | null;
  stats: ModelStats | null;
  isLoading: boolean;
  loadingText: string;
  error: string | null;

  // Modals & overlays
  isScreenDropZoneOpen: boolean;
  isCommandPaletteOpen: boolean;
  isKeyboardHelpOpen: boolean;
  showControlsHint: boolean;

  // Viewer controls
  showGrid: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  lightingPreset: LightingPreset;
  cameraResetTrigger: number;
  isFullscreen: boolean;

  // Actions
  loadFile: (file: File) => Promise<void>;
  loadSampleModel: (type?: "drone" | "mech") => void;
  clearFile: () => void;
  setStats: (stats: ModelStats | null) => void;
  setLoading: (loading: boolean, text?: string) => void;
  setError: (error: string | null) => void;

  // Modal actions
  openScreenDropZone: () => void;
  closeScreenDropZone: () => void;
  toggleScreenDropZone: () => void;

  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  openKeyboardHelp: () => void;
  closeKeyboardHelp: () => void;
  toggleKeyboardHelp: () => void;
  setShowControlsHint: (show: boolean) => void;

  // Viewer toggles
  toggleGrid: () => void;
  toggleWireframe: () => void;
  toggleAutoRotate: () => void;
  setLightingPreset: (preset: LightingPreset) => void;
  triggerResetCamera: () => void;
  toggleFullscreen: () => void;
  setIsFullscreen: (full: boolean) => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  currentView: "landing",
  setView: (view) => set({ currentView: view }),

  file: null,
  stats: null,
  isLoading: false,
  loadingText: "Loading 3D model...",
  error: null,

  isScreenDropZoneOpen: false,
  isCommandPaletteOpen: false,
  isKeyboardHelpOpen: false,
  showControlsHint: true,

  showGrid: true,
  wireframe: false,
  autoRotate: false,
  lightingPreset: "city",
  cameraResetTrigger: 0,
  isFullscreen: false,

  loadFile: async (file: File) => {
    const ext = getFileExtension(file.name) as SupportedFormat;
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      set({
        error: `Unsupported format ".${ext}". Supported: GLB, GLTF, OBJ, STL, FBX, PLY.`,
      });
      setTimeout(() => set({ error: null }), 4500);
      return;
    }

    const { file: prevFile } = get();
    if (prevFile?.url && prevFile.format !== "sample") {
      URL.revokeObjectURL(prevFile.url);
    }

    set({
      isLoading: true,
      loadingText: `Reading ${file.name}...`,
      currentView: "viewer",
      isScreenDropZoneOpen: false,
      error: null,
    });

    try {
      const buffer = await file.arrayBuffer();
      const blobUrl = URL.createObjectURL(file);

      set({
        file: {
          name: file.name,
          size: file.size,
          url: blobUrl,
          format: ext,
          buffer,
          rawFile: file,
        },
        stats: null,
        isLoading: false,
        loadingText: "",
        currentView: "viewer",
        isScreenDropZoneOpen: false,
        error: null,
        showControlsHint: true,
      });
    } catch (err) {
      console.error("Failed to read file buffer:", err);
      set({
        error: `Could not read ${file.name}. Please try again.`,
        isLoading: false,
      });
    }
  },

  loadSampleModel: (type = "drone") => {
    const { file: prevFile } = get();
    if (prevFile?.url && prevFile.format !== "sample") {
      URL.revokeObjectURL(prevFile.url);
    }

    set({
      file: {
        name:
          type === "drone"
            ? "aerospace_scout_sample.glb"
            : "polyhedral_core_sample.obj",
        size: 245000,
        url: `sample://${type}`,
        format: "sample",
      },
      stats: null,
      isLoading: true,
      loadingText: "Constructing sample 3D mesh...",
      currentView: "viewer",
      isScreenDropZoneOpen: false,
      error: null,
      showControlsHint: true,
    });
  },

  clearFile: () => {
    const { file } = get();
    if (file?.url && file.format !== "sample") {
      URL.revokeObjectURL(file.url);
    }
    set({
      file: null,
      stats: null,
      currentView: "landing",
      wireframe: false,
      autoRotate: false,
      isScreenDropZoneOpen: false,
      isLoading: false,
    });
  },

  setStats: (stats) => set({ stats }),

  setLoading: (isLoading, loadingText = "Processing 3D model...") =>
    set({ isLoading, loadingText }),

  setError: (error) => {
    set({ error });
    if (error) {
      setTimeout(() => {
        if (get().error === error) {
          set({ error: null });
        }
      }, 4500);
    }
  },

  openScreenDropZone: () => set({ isScreenDropZoneOpen: true }),
  closeScreenDropZone: () => set({ isScreenDropZoneOpen: false }),
  toggleScreenDropZone: () =>
    set((s) => ({ isScreenDropZoneOpen: !s.isScreenDropZoneOpen })),

  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),

  openKeyboardHelp: () => set({ isKeyboardHelpOpen: true }),
  closeKeyboardHelp: () => set({ isKeyboardHelpOpen: false }),
  toggleKeyboardHelp: () =>
    set((s) => ({ isKeyboardHelpOpen: !s.isKeyboardHelpOpen })),

  setShowControlsHint: (showControlsHint) => set({ showControlsHint }),

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleWireframe: () => set((s) => ({ wireframe: !s.wireframe })),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
  setLightingPreset: (preset) => set({ lightingPreset: preset }),
  triggerResetCamera: () =>
    set((s) => ({ cameraResetTrigger: s.cameraResetTrigger + 1 })),

  toggleFullscreen: () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {});
      set({ isFullscreen: false });
    }
  },

  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
}));

if (typeof window !== "undefined") {
  (window as any).__VIEWER_STORE__ = useViewerStore;
}
