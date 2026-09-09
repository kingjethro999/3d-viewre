"use client";

import { useEffect } from "react";
import { useViewerStore } from "@/app/store/viewer-store";

export function KeyboardListener() {
  const {
    toggleCommandPalette,
    closeCommandPalette,
    closeScreenDropZone,
    closeKeyboardHelp,
    openScreenDropZone,
    toggleGrid,
    toggleWireframe,
    toggleAutoRotate,
    triggerResetCamera,
    toggleFullscreen,
    toggleKeyboardHelp,
    loadSampleModel,
    isCommandPaletteOpen,
    isScreenDropZoneOpen,
    isKeyboardHelpOpen,
  } = useViewerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing into an input/textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Meta+K or Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // If user is inside an input, do not trigger single-key viewer shortcuts
      if (isInput) return;

      // Escape closes open overlays
      if (e.key === "Escape") {
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isScreenDropZoneOpen) closeScreenDropZone();
        if (isKeyboardHelpOpen) closeKeyboardHelp();
        return;
      }

      // Viewer keyboard actions
      switch (e.key.toLowerCase()) {
        case "w":
          e.preventDefault();
          toggleWireframe();
          break;
        case "g":
          e.preventDefault();
          toggleGrid();
          break;
        case " ":
          e.preventDefault();
          toggleAutoRotate();
          break;
        case "r":
          e.preventDefault();
          triggerResetCamera();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "u":
          e.preventDefault();
          openScreenDropZone();
          break;
        case "h":
        case "?":
          e.preventDefault();
          toggleKeyboardHelp();
          break;
        case "s":
          e.preventDefault();
          loadSampleModel("drone");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    toggleCommandPalette,
    closeCommandPalette,
    closeScreenDropZone,
    closeKeyboardHelp,
    openScreenDropZone,
    toggleGrid,
    toggleWireframe,
    toggleAutoRotate,
    triggerResetCamera,
    toggleFullscreen,
    toggleKeyboardHelp,
    loadSampleModel,
    isCommandPaletteOpen,
    isScreenDropZoneOpen,
    isKeyboardHelpOpen,
  ]);

  return null;
}
