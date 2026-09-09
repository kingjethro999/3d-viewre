"use client";

import { useEffect, useRef } from "react";
import { useViewerStore, ACCEPTED_EXTENSIONS_STRING } from "@/app/store/viewer-store";

export function triggerGlobalUpload() {
  const el = document.getElementById("global-hidden-file-input") as HTMLInputElement | null;
  if (el) {
    el.click();
  }
}

export function GlobalFileInput() {
  const { loadFile } = useViewerStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
    // Clear value so the same file can be selected again
    e.target.value = "";
  };

  useEffect(() => {
    // Window-level drop listener to handle files dropped anywhere on screen
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        loadFile(file);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    // Expose helpers on window for external triggers and debugging
    if (typeof window !== "undefined") {
      (window as any).__TRIGGER_UPLOAD__ = triggerGlobalUpload;
      (window as any).__LOAD_FILE__ = loadFile;
    }

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [loadFile]);

  return (
    <input
      ref={inputRef}
      id="global-hidden-file-input"
      type="file"
      accept={ACCEPTED_EXTENSIONS_STRING}
      onChange={handleChange}
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        opacity: 0,
        pointerEvents: "none",
        width: "1px",
        height: "1px",
      }}
    />
  );
}
