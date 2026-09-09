"use client";

import { useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { useViewerStore } from "@/app/store/viewer-store";

export function KeyboardHelpModal() {
  const { isKeyboardHelpOpen, closeKeyboardHelp } = useViewerStore();

  useEffect(() => {
    if (!isKeyboardHelpOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeKeyboardHelp();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isKeyboardHelpOpen, closeKeyboardHelp]);

  if (!isKeyboardHelpOpen) return null;

  const shortcuts = [
    { key: "⌘K / Ctrl+K", desc: "Open Command Palette / Action List" },
    { key: "W", desc: "Toggle Wireframe Analysis Mode" },
    { key: "G", desc: "Toggle Ground Grid Overlay" },
    { key: "Space", desc: "Toggle Turntable Auto-Rotation" },
    { key: "R", desc: "Reset Camera to Default Angle" },
    { key: "F", desc: "Toggle Fullscreen Viewport" },
    { key: "U", desc: "Open Screen-Wide Upload Drop Zone" },
    { key: "? / H", desc: "Open Keyboard Shortcuts Help" },
    { key: "Esc", desc: "Close Current Modal / Dialog" },
    { key: "LMB Drag", desc: "Rotate Orbit Camera" },
    { key: "RMB Drag", desc: "Pan Camera In Plane" },
    { key: "Scroll", desc: "Zoom In / Out" },
  ];

  return (
    <div
      className="modal-backdrop"
      onClick={closeKeyboardHelp}
      role="dialog"
      aria-modal="true"
      id="keyboard-help-modal"
    >
      <div
        className="command-palette-container"
        style={{ maxWidth: "480px", padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="feature-icon-box" style={{ width: "32px", height: "32px", marginBottom: 0 }}>
              <Keyboard size={18} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={closeKeyboardHelp}
            className="btn-icon-subtle"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {shortcuts.map((s) => (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-surface)",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{s.desc}</span>
              <kbd style={{ flexShrink: 0 }}>{s.key}</kbd>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
          <button
            onClick={closeKeyboardHelp}
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Close Shortcuts
          </button>
        </div>
      </div>
    </div>
  );
}
