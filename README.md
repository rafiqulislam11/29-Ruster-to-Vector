# CreativeForge AI
### AI Image • Gradient • Glass • Vector • Icon Studio

> A complete, production-ready, modern SaaS platform designed for non-destructive creative asset workflows: **Upload Once → Transform into Infinite Creative Outputs**.

🌐 **Live Website:** [https://rafiqulislam11.github.io/29-Ruster-to-Vector/](https://rafiqulislam11.github.io/29-Ruster-to-Vector/)

---

## ✦ Core Features & Tool Suite

### 1. Image Studio
- **Image → Gradient**: Analyzes uploaded images, extracts dominant color harmonies via k-means clustering, and generates Linear, Radial, Mesh, Multi-Color, Soft, and Blur gradients.
- **AI Image Upscaler**: 2K, 4K, 6K, and 8K multi-scale resolution synthesis with high-frequency unsharp masking, edge-directed interpolation, detail recovery, and an extensible `AIProvider` backend layer.
- **Film Grain Engine**: Procedural analog noise generator with 5 presets (*Fine Grain, Classic Film, Cinematic, Vintage, Heavy Grain*) and real-time contrast, size, and blend controls.
- **Fractal Glass Engine (6 Presets)**:
  - `Fractal Glass 1`: Soft transparent glass
  - `Fractal Glass 2`: Crystal/refraction glass
  - `Fractal Glass 3`: Complex fractured glass
  - `Fractal Glass 3.1`: Fine fractal distortion
  - `Fractal Glass 3.2`: Deep refraction and layered glass
  - `Fractal Glass 3.3`: Premium abstract glass distortion
- **Gradient Maker (4 Systems)**:
  - System 1: Simple professional gradient
  - System 2: Advanced multi-color gradient
  - System 3: Abstract fluid mesh gradient
  - System 4: Premium creative gradient with textured lighting & organic noise

### 2. Vector & Icon Studio
- **Image → Vector**: Authentic vector tracing engine that analyzes contours and outputs valid, scalable `<svg>` `<path>` vector geometry.
- **Vector Trace**: Fine-tuned contour thresholding and curve simplification.
- **Remove White Background**: Intelligent color distance detection, smooth edge feathering, and subtle contact shadow preservation.
- **Transparent Background**: General luminance-alpha and chroma masking.
- **Icon Sheet Maker (3 Layouts)**:
  - `Icon Sheet 1`: Minimal grid
  - `Icon Sheet 2`: Professional marketplace layout
  - `Icon Sheet 3`: Premium presentation sheet
- **Icon Pack Maker**: Transforms images into 8 distinct styles (*Outline, Filled, Flat, Minimal, Monochrome, Gradient, 3D, Rounded*) and bundles multi-size PNGs (64px, 128px, 256px, 512px) + SVGs into a downloadable ZIP package.

### 3. Unified 3-Panel Creative Workspace
- **Top Toolbar**: Universal Upload, Project Renaming, Undo/Redo history, Compare Mode toggle (*Slider, Split View, Side-by-Side*), Reset, Save Project, Export.
- **Left Sidebar**: 17 Categorized creative tools with instant switching.
- **Center Canvas**: Interactive pan & zoom (25% to 800%), fit-to-screen, and draggable before/after comparison slider.
- **Right Panel**: Dynamic tool-specific inspector with live sliders, resolution selectors, and swatches.

### 4. SaaS Infrastructure & Admin
- **Non-Destructive Storage**: Original assets are permanently preserved.
- **Relational SQLite Persistence**: Users, Projects, Assets, ProcessingJobs, Exports, Subscriptions, Usage, Backups.
- **Asynchronous Background Queue**: Multi-worker job processing with status tracking (`queued`, `processing`, `completed`, `failed`).
- **User Dashboard**: Project management (create, duplicate, delete), credit balance, storage meter, and processing history.
- **Admin Console**: User management, credit adjustments, tool enablement toggles, backup triggers, and revenue analytics.
- **Public Marketing Website & SEO**: High-converting landing page with pricing plans (Free, Creator, Professional, Business) and dedicated tool landing pages (`/image-upscaler`, `/image-to-vector`, etc.).

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Start Server
```bash
npm run server
```
Open your browser at **`http://localhost:5000/`**.

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express, SQLite relational store, Multer, JSZip.
- **Frontend**: Vite, Modern Vanilla JavaScript, Custom Vanilla CSS Design System (Obsidian dark theme, glassmorphism, responsive panels).
- **Engines**: Procedural Canvas Shaders, Potrace Bézier Vectorizer, K-Means Color Quantizer, JSZip packager.
