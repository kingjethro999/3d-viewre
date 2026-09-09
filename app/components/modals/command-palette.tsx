"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Search,
  UploadCloud,
  Grid,
  Box,
  RotateCw,
  Maximize,
  Compass,
  Sun,
  Moon,
  Sparkles,
  Keyboard,
  Home,
  FileCode,
  X,
} from "lucide-react";
import { useViewerStore } from "@/app/store/viewer-store";

interface CommandItem {
  id: string;
  title: string;
  category: "File" | "Viewport" | "Lighting" | "Help";
  shortcut?: string[];
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  action: () => void;
  isActive?: boolean;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    openScreenDropZone,
    loadSampleModel,
    setView,
    showGrid,
    toggleGrid,
    wireframe,
    toggleWireframe,
    autoRotate,
    toggleAutoRotate,
    triggerResetCamera,
    toggleFullscreen,
    isFullscreen,
    lightingPreset,
    setLightingPreset,
    openKeyboardHelp,
  } = useViewerStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "upload",
        title: "Upload 3D Model",
        category: "File",
        shortcut: ["U"],
        icon: UploadCloud,
        action: () => {
          closeCommandPalette();
          openScreenDropZone();
        },
      },
      {
        id: "sample-model",
        title: "Load Sample Drone Model",
        category: "File",
        shortcut: ["S"],
        icon: FileCode,
        action: () => {
          closeCommandPalette();
          loadSampleModel("drone");
        },
      },
      {
        id: "sample-mech",
        title: "Load Sample Core Polyhedron",
        category: "File",
        icon: Sparkles,
        action: () => {
          closeCommandPalette();
          loadSampleModel("mech");
        },
      },
      {
        id: "home",
        title: "Return to Landing Page",
        category: "File",
        icon: Home,
        action: () => {
          closeCommandPalette();
          setView("landing");
        },
      },
      {
        id: "toggle-wireframe",
        title: wireframe ? "Disable Wireframe Mode" : "Enable Wireframe Mode",
        category: "Viewport",
        shortcut: ["W"],
        icon: Box,
        isActive: wireframe,
        action: () => {
          toggleWireframe();
          closeCommandPalette();
        },
      },
      {
        id: "toggle-grid",
        title: showGrid ? "Hide Ground Grid" : "Show Ground Grid",
        category: "Viewport",
        shortcut: ["G"],
        icon: Grid,
        isActive: showGrid,
        action: () => {
          toggleGrid();
          closeCommandPalette();
        },
      },
      {
        id: "toggle-rotate",
        title: autoRotate ? "Stop Auto-Rotation" : "Start Auto-Rotation",
        category: "Viewport",
        shortcut: ["Space"],
        icon: RotateCw,
        isActive: autoRotate,
        action: () => {
          toggleAutoRotate();
          closeCommandPalette();
        },
      },
      {
        id: "reset-camera",
        title: "Reset Camera View",
        category: "Viewport",
        shortcut: ["R"],
        icon: Compass,
        action: () => {
          triggerResetCamera();
          closeCommandPalette();
        },
      },
      {
        id: "fullscreen",
        title: isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
        category: "Viewport",
        shortcut: ["F"],
        icon: Maximize,
        isActive: isFullscreen,
        action: () => {
          toggleFullscreen();
          closeCommandPalette();
        },
      },
      {
        id: "lighting-city",
        title: "Lighting: City Daylight",
        category: "Lighting",
        icon: Sun,
        isActive: lightingPreset === "city",
        action: () => {
          setLightingPreset("city");
          closeCommandPalette();
        },
      },
      {
        id: "lighting-studio",
        title: "Lighting: Studio Neutral",
        category: "Lighting",
        icon: Sun,
        isActive: lightingPreset === "studio",
        action: () => {
          setLightingPreset("studio");
          closeCommandPalette();
        },
      },
      {
        id: "lighting-sunset",
        title: "Lighting: Sunset Warm",
        category: "Lighting",
        icon: Sun,
        isActive: lightingPreset === "sunset",
        action: () => {
          setLightingPreset("sunset");
          closeCommandPalette();
        },
      },
      {
        id: "lighting-night",
        title: "Lighting: Night Low-Key",
        category: "Lighting",
        icon: Moon,
        isActive: lightingPreset === "night",
        action: () => {
          setLightingPreset("night");
          closeCommandPalette();
        },
      },
      {
        id: "shortcuts",
        title: "View All Keyboard Shortcuts",
        category: "Help",
        shortcut: ["?"],
        icon: Keyboard,
        action: () => {
          closeCommandPalette();
          openKeyboardHelp();
        },
      },
    ],
    [
      wireframe,
      showGrid,
      autoRotate,
      isFullscreen,
      lightingPreset,
      closeCommandPalette,
      openScreenDropZone,
      loadSampleModel,
      setView,
      toggleWireframe,
      toggleGrid,
      toggleAutoRotate,
      triggerResetCamera,
      toggleFullscreen,
      setLightingPreset,
      openKeyboardHelp,
    ]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower) ||
        (cmd.shortcut &&
          cmd.shortcut.some((s) => s.toLowerCase().includes(lower)))
    );
  }, [commands, query]);

  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={closeCommandPalette}
      role="dialog"
      aria-modal="true"
      id="command-palette-modal"
    >
      <div
        className="command-palette-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="command-search-header">
          <Search size={18} strokeWidth={2} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search actions..."
            className="command-search-input"
            id="command-palette-search-input"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="btn-icon-subtle"
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Command List */}
        <div ref={listRef} className="command-list" id="command-list-items">
          {filteredCommands.length === 0 ? (
            <div style={{ padding: "36px 0", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
              No commands matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`command-item ${isSelected ? "selected" : ""}`}
                  id={`cmd-${cmd.id}`}
                >
                  <div className="command-item-left">
                    <div className="command-icon-badge">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>
                      {cmd.title}
                    </span>
                    {cmd.isActive && (
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          backgroundColor: "rgba(16, 185, 129, 0.15)",
                          color: "var(--success)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {cmd.shortcut?.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="command-palette-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <kbd>↵</kbd> Select
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <kbd>Esc</kbd> Close
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-light)", fontWeight: 600 }}>
            3D Viewre
          </span>
        </div>
      </div>
    </div>
  );
}
