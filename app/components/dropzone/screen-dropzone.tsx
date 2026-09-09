"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  UploadCloud,
  FileCode,
  X,
  FolderOpen,
} from "lucide-react";
import {
  useViewerStore,
  SUPPORTED_EXTENSIONS,
  ACCEPTED_EXTENSIONS_STRING,
} from "@/app/store/viewer-store";

export function ScreenDropZone() {
  const {
    isScreenDropZoneOpen,
    closeScreenDropZone,
    loadFile,
    loadSampleModel,
  } = useViewerStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global window drag & drop listener to activate screen-wide overlay
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        setDragDepth((prev) => prev + 1);
        setIsDragOver(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragDepth((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsDragOver(false);
          return 0;
        }
        return next;
      });
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      setDragDepth(0);

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        loadFile(file);
      }
    };

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [loadFile]);

  // Handle escape key to close dropzone
  useEffect(() => {
    if (!isScreenDropZoneOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeScreenDropZone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScreenDropZoneOpen, closeScreenDropZone]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        loadFile(file);
      }
      if (e.target) {
        e.target.value = "";
      }
    },
    [loadFile]
  );

  const isVisible = isScreenDropZoneOpen || isDragOver;

  if (!isVisible) return null;

  return (
    <div
      className="screen-dropzone-modal"
      onClick={closeScreenDropZone}
      role="dialog"
      aria-modal="true"
      id="screen-dropzone-modal"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS_STRING}
        onChange={handleInputChange}
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
          width: "1px",
          height: "1px",
        }}
        id="screen-file-input"
      />

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeScreenDropZone();
          setIsDragOver(false);
          setDragDepth(0);
        }}
        className="btn-icon-subtle"
        style={{ position: "absolute", top: "24px", right: "24px" }}
        aria-label="Close upload zone"
        id="btn-close-dropzone"
      >
        <X size={22} strokeWidth={2} />
      </button>

      {/* Screen wide card container */}
      <div
        className={`screen-dropzone-inner ${isDragOver ? "drag-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          setDragDepth(0);
          const file = e.dataTransfer?.files?.[0];
          if (file) {
            loadFile(file);
          }
        }}
        id="screen-dropzone-interactive"
      >
        {/* Solid Icon Box */}
        <div className="hero-dropzone-icon" style={{ width: "72px", height: "72px", marginBottom: "24px" }}>
          <UploadCloud size={36} strokeWidth={2} />
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
          Drop your 3D model here
        </h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "460px", lineHeight: 1.5, marginBottom: "28px" }}>
          Upload any 3D asset to inspect geometry, topology, and wireframes.
          Files are processed 100% locally in your browser.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
          <button
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            id="browse-files-action"
          >
            <FolderOpen size={16} strokeWidth={2} />
            Browse From Device
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleModel("drone");
            }}
            id="sample-model-action"
          >
            <FileCode size={16} strokeWidth={2} style={{ color: "var(--accent-light)" }} />
            Try Sample Model
          </button>
        </div>

        {/* Supported format tags */}
        <div className="format-tags-row">
          <p style={{ width: "100%", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "10px" }}>
            Supported Formats
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {SUPPORTED_EXTENSIONS.map((ext) => (
              <span key={ext} className="format-tag">
                .{ext}
              </span>
            ))}
          </div>
        </div>

        {/* Footer shortcuts hint */}
        <div style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Press</span>
          <kbd>Esc</kbd>
          <span>to dismiss</span>
        </div>
      </div>
    </div>
  );
}
