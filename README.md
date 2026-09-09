# 3D Viewre

A high-performance, client-side 3D model inspection platform built with Next.js 16, Three.js, React Three Fiber, and Zustand. 3D Viewre enables instant rendering, wireframe analysis, and topology audits across major 3D asset formats directly inside the browser with zero server uploads and complete client-side data privacy.

---

## Architectural Highlights

* **100% Client-Side Privacy:** Files never leave the client device. Geometry, buffers, and textures are parsed purely within browser memory via dedicated binary ArrayBuffer loaders.
* **Broad Multi-Format Support:** Inspect GLB, GLTF, Wavefront OBJ, Stereolithography STL, Polygon PLY, and Filmbox FBX files seamlessly.
* **Automated Bounding Normalization:** Every loaded model is measured via three-dimensional bounding boxes, scaled proportionally to viewport bounds, and grounded to surface elevation.
* **Instant Topology Inspection:** Switch to single-layer wireframe mode to audit polygon triangulation, vertex distribution, edge loops, and surface normal orientations.
* **Command Palette (⌘K / Ctrl+K):** Power-user command palette for rapid keyboard navigation, lighting environment changes, and viewport control.
* **Unified Zustand State Management:** Decoupled store architecture ensuring clean separation between Three.js Canvas render loops and React UI overlays.
* **Offline Three-Point Lighting Presets:** High-fidelity studio lighting setups (City Daylight, Neutral Studio, Sunset Warmth, Low-Key Night) with soft shadow mapping without relying on external CDN HDR downloads.

---

## Supported File Formats

| Format | Full Name | Processing Method | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **.GLB** | GL Transmission Binary | Native Binary Buffer Parser | Self-contained game and web assets |
| **.GLTF** | GL Transmission Format | JSON Scene Graph Loader | Modern web and interactive 3D graphics |
| **.OBJ** | Wavefront Object | Text Geometry Parser | Digital sculpting and static meshes |
| **.STL** | Stereolithography | Binary Buffer Geometry Loader | 3D printing and additive manufacturing |
| **.PLY** | Polygon File Format | Buffer Geometry Parser | Photogrammetry and LiDAR point clouds |
| **.FBX** | Filmbox Asset | Binary Node Parser | Rigged models and cinematic exchange |

---

## Keyboard Shortcuts

| Shortcut | Action Description |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Command Palette modal |
| `W` | Toggle Wireframe and Topology Inspection |
| `G` | Toggle Ground Coordinate Grid |
| `Space` | Toggle Turntable Auto-Rotation |
| `R` | Reset Camera to Default Isometric Angle |
| `F` | Toggle Fullscreen Viewport Mode |
| `U` | Open File Chooser Dialog |
| `?` | Display Keyboard Shortcuts Cheatsheet |
| `Esc` | Dismiss Open Modals and Overlays |

---

## Technical Stack

* **Core Framework:** Next.js 16 (App Router)
* **View Library:** React 19
* **3D Engine:** Three.js
* **Canvas Integration:** React Three Fiber (R3F) and @react-three/drei
* **State Management:** Zustand 5
* **Iconography:** Lucide React
* **Styling:** Custom Vanilla CSS Design System with pure solid surfaces and zero uncalibrated gradients

---

## Directory Architecture

```
glbviewer/
├── app/
│   ├── components/
│   │   ├── brand/
│   │   │   └── logo.tsx                # Isometric polyhedral SVG logo
│   │   ├── dropzone/
│   │   │   ├── global-file-input.tsx   # Persistent native file picker bridge
│   │   │   └── screen-dropzone.tsx     # Fullscreen drag-and-drop modal
│   │   ├── landing/
│   │   │   └── landing-page.tsx        # Hero, features, formats matrix, CTA
│   │   ├── modals/
│   │   │   ├── command-palette.tsx     # ⌘K searchable action palette
│   │   │   └── keyboard-help-modal.tsx # Shortcuts cheatsheet modal
│   │   └── viewer/
│   │   │   ├── keyboard-listener.tsx   # Global hotkey event router
│   │   │   ├── model-info-header.tsx   # Asset metadata, format badge, stats
│   │   │   ├── model-renderer.tsx      # Multi-format Three.js geometry engine
│   │   │   ├── viewer-toolbar.tsx      # Viewport floating action bar
│   │   │   └── viewer-viewport.tsx     # Three.js Canvas, lighting, orbit controls
│   ├── store/
│   │   └── viewer-store.ts             # Centralized Zustand reactive store
│   ├── globals.css                     # Solid-color theme and typography system
│   ├── layout.tsx                      # Root HTML layout and metadata
│   └── page.tsx                        # Root view router
├── public/
│   └── icon.svg                        # 3D Viewre application icon
└── package.json
```

---

## Getting Started

### Prerequisites

* Node.js 18.18 or later
* pnpm (recommended), npm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kingjethro999/3d-viewre.git
   cd 3d-viewre
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the local development server:
   ```bash
   pnpm dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## Production Build

To generate an optimized production bundle:

```bash
pnpm build
pnpm start
```

---

## License

MIT License. Free for commercial and personal use.
