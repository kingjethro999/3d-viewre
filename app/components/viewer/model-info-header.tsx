"use client";

import { Box, ChevronLeft, UploadCloud, Command } from "lucide-react";
import { useViewerStore, formatFileSize } from "@/app/store/viewer-store";

export function ModelInfoHeader() {
  const {
    file,
    stats,
    setView,
    openScreenDropZone,
    openCommandPalette,
  } = useViewerStore();

  if (!file) return null;

  return (
    <header className="viewer-top-header">
      {/* Left side: Back button & Model Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => setView("landing")}
          className="btn-secondary"
          style={{ padding: "8px 14px", fontSize: "12.5px" }}
          data-tooltip="Return to Landing Page"
          id="btn-back-to-landing"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span>Home</span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 14px",
            backgroundColor: "rgba(17, 19, 26, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-medium)",
            borderRadius: "10px",
            fontSize: "12.5px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box size={16} strokeWidth={2} />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </span>
              <span className="format-tag" style={{ padding: "2px 6px", fontSize: "10px" }}>
                {file.format}
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {formatFileSize(file.size)}
            </span>
          </div>

          {/* Geometry Statistics */}
          {stats && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderLeft: "1px solid var(--border-medium)",
                paddingLeft: "12px",
                fontSize: "11.5px",
                color: "var(--text-secondary)",
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)" }}>Verts: </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>
                  {stats.vertices.toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Tris: </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>
                  {stats.triangles.toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Meshes: </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>
                  {stats.meshes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Quick Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={openCommandPalette}
          className="btn-secondary"
          style={{ padding: "8px 14px", fontSize: "12.5px" }}
          data-tooltip="Open Command Palette (⌘K)"
          id="btn-open-palette-header"
        >
          <Command size={14} strokeWidth={2} />
          <span>Commands</span>
          <kbd>⌘K</kbd>
        </button>

        <button
          onClick={openScreenDropZone}
          className="btn-primary"
          style={{ padding: "8px 14px", fontSize: "12.5px" }}
          data-tooltip="Upload Another Model (U)"
          id="btn-upload-header"
        >
          <UploadCloud size={15} strokeWidth={2} />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
}
