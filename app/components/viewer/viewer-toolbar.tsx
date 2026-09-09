"use client";

import {
  RotateCcw,
  Grid,
  Box,
  RotateCw,
  Sun,
  Maximize,
  Minimize,
  Keyboard,
  Command,
  UploadCloud,
} from "lucide-react";
import { useViewerStore, LightingPreset } from "@/app/store/viewer-store";

export function ViewerToolbar() {
  const {
    showGrid,
    toggleGrid,
    wireframe,
    toggleWireframe,
    autoRotate,
    toggleAutoRotate,
    triggerResetCamera,
    lightingPreset,
    setLightingPreset,
    toggleFullscreen,
    isFullscreen,
    openKeyboardHelp,
    openCommandPalette,
    openScreenDropZone,
  } = useViewerStore();

  const cycleLighting = () => {
    const presets: LightingPreset[] = ["city", "studio", "sunset", "night"];
    const nextIndex = (presets.indexOf(lightingPreset) + 1) % presets.length;
    setLightingPreset(presets[nextIndex]);
  };

  return (
    <div className="viewer-bottom-toolbar" id="viewer-toolbar">
      {/* Reset Camera */}
      <button
        type="button"
        onClick={triggerResetCamera}
        data-tooltip="Reset Camera (R)"
        className="toolbar-btn"
        id="tb-reset-camera"
        aria-label="Reset Camera"
      >
        <RotateCcw size={18} strokeWidth={2} />
      </button>

      {/* Toggle Grid */}
      <button
        type="button"
        onClick={toggleGrid}
        data-tooltip={`Ground Grid: ${showGrid ? "On" : "Off"} (G)`}
        className={`toolbar-btn ${showGrid ? "active" : ""}`}
        id="tb-toggle-grid"
        aria-label="Toggle Grid"
      >
        <Grid size={18} strokeWidth={2} />
      </button>

      {/* Toggle Wireframe */}
      <button
        type="button"
        onClick={toggleWireframe}
        data-tooltip={`Wireframe: ${wireframe ? "On" : "Off"} (W)`}
        className={`toolbar-btn ${wireframe ? "active" : ""}`}
        id="tb-toggle-wireframe"
        aria-label="Toggle Wireframe"
      >
        <Box size={18} strokeWidth={2} />
      </button>

      {/* Auto Rotate */}
      <button
        type="button"
        onClick={toggleAutoRotate}
        data-tooltip={`Turntable Rotate: ${autoRotate ? "On" : "Off"} (Space)`}
        className={`toolbar-btn ${autoRotate ? "active" : ""}`}
        id="tb-auto-rotate"
        aria-label="Toggle Auto-Rotate"
      >
        <RotateCw size={18} strokeWidth={2} />
      </button>

      {/* Lighting Preset */}
      <button
        type="button"
        onClick={cycleLighting}
        data-tooltip={`Lighting: ${lightingPreset}`}
        className="toolbar-btn"
        id="tb-cycle-lighting"
        aria-label="Cycle Lighting"
      >
        <Sun size={18} strokeWidth={2} />
      </button>

      <div className="toolbar-divider" />

      {/* Fullscreen */}
      <button
        type="button"
        onClick={toggleFullscreen}
        data-tooltip="Fullscreen (F)"
        className={`toolbar-btn ${isFullscreen ? "active" : ""}`}
        id="tb-fullscreen"
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? (
          <Minimize size={18} strokeWidth={2} />
        ) : (
          <Maximize size={18} strokeWidth={2} />
        )}
      </button>

      {/* Keyboard help */}
      <button
        type="button"
        onClick={openKeyboardHelp}
        data-tooltip="Keyboard Shortcuts (?)"
        className="toolbar-btn"
        id="tb-keyboard-help"
        aria-label="Keyboard Shortcuts"
      >
        <Keyboard size={18} strokeWidth={2} />
      </button>

      {/* Command palette */}
      <button
        type="button"
        onClick={openCommandPalette}
        data-tooltip="Command Palette (⌘K)"
        className="toolbar-btn"
        id="tb-command-palette"
        aria-label="Command Palette"
      >
        <Command size={18} strokeWidth={2} />
      </button>

      <div className="toolbar-divider" />

      {/* Upload New File */}
      <button
        type="button"
        onClick={openScreenDropZone}
        data-tooltip="Upload 3D Model (U)"
        className="toolbar-btn"
        style={{ color: "var(--accent-light)", backgroundColor: "var(--bg-surface-elevated)" }}
        id="tb-upload-file"
        aria-label="Upload Model"
      >
        <UploadCloud size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
