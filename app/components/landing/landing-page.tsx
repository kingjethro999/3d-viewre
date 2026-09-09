"use client";

import {
  UploadCloud,
  Layers,
  Box,
  Compass,
  Command,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  FolderOpen,
  Sun,
} from "lucide-react";
import { useViewerStore, SUPPORTED_EXTENSIONS } from "@/app/store/viewer-store";
import { Logo } from "@/app/components/brand/logo";
import { triggerGlobalUpload } from "@/app/components/dropzone/global-file-input";

export function LandingPage() {
  const { openScreenDropZone, openCommandPalette, loadSampleModel, loadFile } =
    useViewerStore();

  const features = [
    {
      icon: Box,
      title: "Multi-Format Support",
      description:
        "Seamlessly inspect GLB, GLTF, OBJ, STL, FBX, and PLY files with automatic scale normalization and bounding alignment.",
    },
    {
      icon: Layers,
      title: "Wireframe & Topology",
      description:
        "Switch to wireframe mode to inspect polygon density, mesh triangulation, vertex distribution, and surface normals.",
    },
    {
      icon: Compass,
      title: "Fluid Orbit Navigation",
      description:
        "Smooth 60fps orbital rotation, panning, and responsive zoom powered by physically damped Three.js controls.",
    },
    {
      icon: Command,
      title: "Command Palette & Hotkeys",
      description:
        "Trigger rapid viewport actions, lighting presets, and model operations instantly using ⌘K / Ctrl+K keyboard workflows.",
    },
    {
      icon: Sun,
      title: "Dynamic Lighting Presets",
      description:
        "Toggle between City Daylight, Neutral Studio, Warm Sunset, and Low-Key Night lighting environments.",
    },
    {
      icon: ShieldCheck,
      title: "100% Private & In-Browser",
      description:
        "Your 3D assets never leave your computer. Parsing and rendering are executed purely within client memory.",
    },
  ];

  const formatDetails = [
    {
      ext: "GLB",
      name: "GL Transmission Binary",
      desc: "Standard self-contained binary 3D assets with materials and textures.",
    },
    {
      ext: "GLTF",
      name: "GL Transmission Format",
      desc: "JSON-based 3D scene definition for modern web applications.",
    },
    {
      ext: "OBJ",
      name: "Wavefront Object",
      desc: "Classic geometry file supporting polygonal meshes and coordinates.",
    },
    {
      ext: "STL",
      name: "Stereolithography",
      desc: "Standard 3D printing format representing surface geometry meshes.",
    },
    {
      ext: "FBX",
      name: "Filmbox Asset",
      desc: "Complex 3D exchange format commonly exported from Blender and Maya.",
    },
    {
      ext: "PLY",
      name: "Polygon File Format",
      desc: "High-density polygonal models and scanner geometries.",
    },
  ];

  const shortcutsList = [
    { key: "⌘K / Ctrl+K", action: "Open Command Palette" },
    { key: "W", action: "Toggle Wireframe Analysis" },
    { key: "G", action: "Toggle Ground Grid" },
    { key: "Space", action: "Toggle Turntable Rotation" },
    { key: "R", action: "Reset Camera Orientation" },
    { key: "F", action: "Toggle Fullscreen Viewport" },
    { key: "U", action: "Trigger Upload Drop Zone" },
    { key: "?", action: "Keyboard Shortcuts Cheatsheet" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation */}
      <header className="app-navbar">
        <div className="app-navbar-container">
          <Logo size="md" />

          {/* Nav Links */}
          <nav className="nav-links" style={{ display: "flex" }}>
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#formats" className="nav-link">
              Supported Formats
            </a>
            <a href="#shortcuts" className="nav-link">
              Shortcuts
            </a>
          </nav>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={openCommandPalette}
              className="btn-secondary"
              id="nav-cmd-k-btn"
            >
              <Command size={14} strokeWidth={2} />
              <span>Commands</span>
              <kbd>⌘K</kbd>
            </button>

            <button
              onClick={triggerGlobalUpload}
              className="btn-primary"
              id="nav-upload-btn"
            >
              <UploadCloud size={16} strokeWidth={2} />
              <span>Upload Model</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        {/* Status Pill */}
        <div className="hero-badge">
          <span className="status-dot" />
          <span>Free &amp; Private · In-Browser 3D Engine</span>
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          Inspect 3D Models in Real-Time
        </h1>

        <p className="hero-subtitle">
          Ultra-fast, zero-upload 3D viewer. Inspect geometry, wireframes, and
          topology directly in your browser without transmitting your files to
          any server.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            onClick={triggerGlobalUpload}
            className="btn-primary btn-primary-lg"
            id="hero-upload-btn"
          >
            <UploadCloud size={18} strokeWidth={2} />
            <span>Upload 3D Model</span>
          </button>

          <button
            onClick={() => loadSampleModel("drone")}
            className="btn-secondary btn-secondary-lg"
            id="hero-sample-btn"
          >
            <FileCode size={18} strokeWidth={2} style={{ color: "var(--accent-light)" }} />
            <span>Try Sample Model</span>
          </button>
        </div>

        {/* Large Centered Interactive Drop Card */}
        <div
          onClick={triggerGlobalUpload}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer?.files?.[0];
            if (file) {
              loadFile(file);
            }
          }}
          className="hero-dropzone-card"
          id="hero-dropzone-trigger"
        >
          <div className="hero-dropzone-icon">
            <UploadCloud size={32} strokeWidth={2} />
          </div>

          <h3 className="hero-dropzone-title">
            Drag and drop your 3D model here
          </h3>
          <p className="hero-dropzone-subtitle">
            Click anywhere on this zone or drag a file from your computer. All
            features are 100% free and client-side.
          </p>

          <button
            type="button"
            className="btn-primary"
            style={{ marginBottom: "24px" }}
            onClick={(e) => {
              e.stopPropagation();
              triggerGlobalUpload();
            }}
          >
            <FolderOpen size={16} strokeWidth={2} />
            <span>Select File From Computer</span>
          </button>

          {/* Formats row */}
          <div className="format-tags-row">
            {SUPPORTED_EXTENSIONS.map((ext) => (
              <span key={ext} className="format-tag">
                .{ext}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="landing-section">
        <div className="section-header">
          <h2 className="section-title">
            Engineered for Precision 3D Inspection
          </h2>
          <p className="section-subtitle">
            Everything you need to audit, inspect, and present 3D meshes without
            installing bulky desktop software.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="feature-card">
                <div className="feature-icon-box">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Formats Section */}
      <section id="formats" className="landing-section">
        <div className="section-header">
          <h2 className="section-title">Supported 3D File Formats</h2>
          <p className="section-subtitle">
            3D Viewre provides broad format parsing directly in client memory
            with specialized Three.js geometry loaders.
          </p>
        </div>

        <div className="formats-grid">
          {formatDetails.map((fmt) => (
            <div key={fmt.ext} className="format-card">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span className="format-badge-large">.{fmt.ext}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Native Loader
                  </span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
                  {fmt.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {fmt.desc}
                </p>
              </div>

              <div className="format-status-badge">
                <CheckCircle2 size={14} strokeWidth={2} />
                <span>Instant In-Browser Render</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts Section */}
      <section id="shortcuts" className="landing-section">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2 className="section-title">Power User Keyboard Actions</h2>
            <p className="section-subtitle">
              Inspect models at speed without reaching for your mouse. Use
              built-in hotkeys or bring up the command palette with ⌘K.
            </p>
          </div>
          <button onClick={openCommandPalette} className="btn-secondary">
            <Command size={14} strokeWidth={2} style={{ color: "var(--accent-light)" }} />
            <span>Open Command Palette</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div className="shortcuts-grid">
          {shortcutsList.map((item) => (
            <div key={item.key} className="shortcut-card">
              <span className="shortcut-label">{item.action}</span>
              <kbd>{item.key}</kbd>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section">
        <div className="cta-banner">
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
              Ready to inspect your 3D asset?
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", maxWidth: "540px" }}>
              No account required, no software installation, and completely
              free. Drag any file into the window to launch the engine.
            </p>
          </div>

          <button
            onClick={triggerGlobalUpload}
            className="btn-primary btn-primary-lg"
            id="cta-upload-btn"
          >
            <UploadCloud size={18} strokeWidth={2} />
            <span>Upload 3D Model</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-container">
          <Logo size="sm" />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span>GLB</span>
            <span>·</span>
            <span>GLTF</span>
            <span>·</span>
            <span>OBJ</span>
            <span>·</span>
            <span>STL</span>
            <span>·</span>
            <span>FBX</span>
            <span>·</span>
            <span>PLY</span>
          </div>
          <span>Client-Side Local Rendering Engine</span>
        </div>
      </footer>
    </div>
  );
}
