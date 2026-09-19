# CreativeForge AI — Creative Vector Studio Pro
### Professional Creative Vector, Asset & Microstock Studio

> A complete, production-ready, modern creative suite designed for professional vectorization, interactive vector editing, and commercial asset workflows: **Raster to Vector • Interactive Canvas • 300 PPI Print Standards • Microstock Ready**.

🌐 **Live Demo:** [https://rafiqulislam11.github.io/29-Ruster-to-Vector/](https://rafiqulislam11.github.io/29-Ruster-to-Vector/)

---

## ✦ Complete 17-Studio Architecture

Creative Vector Studio is organized into 17 modular, high-performance studios:

1. **Vector Studio**:
   - **Image → Vector (SVG)**: Authentic Bézier curve tracer with noise reduction, small object elimination, edge enhancement, and corner smoothness.
   - **Vector Trace & Curves**: Fine-tuned contour thresholding, hole preservation (`fill-rule="evenodd"`), and color quantization (Original, Grayscale, B&W Silhouette, Custom Palette).
   - **Layer Grouping**: Export vectors grouped by color (`<g id="color-..." fill="...">`) or by individual path objects.

2. **Background Studio**:
   - **Remove White Background**: Intelligent color distance detection, smooth feathering, and subtle contact shadow preservation.
   - **Transparent Cutout**: Luminance-alpha masking with tolerance controls.
   - **Custom Color & Shadow**: Solid or gradient backdrop placement with procedural ambient contact shadow rendering.

3. **Upscale Studio**:
   - **AI Image Upscaler**: 2x, 4x, 6x, 8x, and 300 PPI Master resolution synthesis with unsharp masking, edge-directed interpolation, and print metric calculations.

4. **Gradient Studio**:
   - 5 Generator Styles: Simple Linear, Multi-Color, Fluid Mesh, Textured Lighting, and Procedural Organic.
   - Live color stops extractor, angle rotation, CSS code generation, and SVG `<linearGradient>` code export.

5. **Glass Studio (6 Presets)**:
   - Soft Transparent Glass, Crystal Refraction, Complex Fractured, Fine Fractal Distortion, Deep Refraction, and Premium Abstract Glass.

6. **Film Grain Studio**:
   - Analog noise generator with 5 presets (*Fine Grain, Classic Film, Cinematic, Vintage, Heavy Grain*) with real-time roughness and opacity blend.

7. **Icon Studio**:
   - Transforms raster artwork into 8 icon styles (*Outline, Filled, Flat, Minimal, Monochrome, Gradient, 3D, Rounded*).

8. **Icon Sheet Studio**:
   - 3 Commercial Layouts: Minimal Grid (Sheet 1), Marketplace Showcase (Sheet 2), Presentation Poster (Sheet 3).
   - Icon Pack Maker: Bundles multi-size PNGs (64px, 128px, 256px, 512px) + SVGs into a downloadable ZIP package.

9. **Canvas Editor**:
   - Interactive vector and raster workspace with 8 transform handles, rotation knob, marquee multi-selection, alignment, and distribution.
   - Interactive Rulers (px, in, mm) and draggable canvas guidelines.
   - Full Layers Panel: Thumbnail preview, inline layer renaming, visibility toggle, lock toggle, opacity slider, layer reordering (move up/down), and delete.
   - 1-Click "Edit on Canvas" transfer from Vector Studio to Canvas paths without reloading.

10. **Batch Studio (500+ Assets)**:
    - High-throughput queue engine capable of batching 500+ assets with configurable concurrency (1 to 8 workers).
    - Live time-remaining (ETA) and processing rate (img/sec) calculation.
    - Pause, resume, and cancel capabilities with per-asset parameter overrides.
    - Automated master 300 PPI ZIP generation with batch manifest report.

11. **Metadata Studio**:
    - Commercial microstock IPTC/XMP tagging studio.
    - Title, Commercial Description, 20-50 Keyword discovery suggestions, Category, Subcategory, Design Type, Orientation, and AI Generated declarations.
    - Bulk batch metadata application and 1-click CSV and JSON export.

12. **Stock Ready Workflow (1-Click Pipeline)**:
    - Automated 10-step microstock export pipeline:
      1. Noise & Speckle Cleanup
      2. Color Quantization
      3. Bézier Vector Contour Tracing
      4. Hole & Silhouette Preservation (`evenodd`)
      5. Layer Grouping by Color
      6. Physical 300 PPI Metadata Injection
      7. Pre-flight Microstock Technical Validation (Resolution, Aspect Ratio, Layer Structure, Open Paths Check)
      8. Multi-format Asset Rendering (SVG, EPS, PNG, PDF)
      9. Commercial Metadata Generation
      10. ZIP Package Assembly & Download

13. **Preset Manager**:
    - 11 built-in industry vector presets (*Adobe Stock Vector, Freepik Clean Vector, Logo B&W Silhouette, Clean SVG Icon, 300 PPI Print Master, Sticker Cutout, Line Art Minimal, T-Shirt Graphic Vector, Crisp Vinyl Plotter, UI Vector Illustration, Extreme Precision Vector*).
    - Save current settings as custom preset, duplicate, delete, and full JSON import/export.

14. **Project Hub & Version History**:
    - Create, open, save, duplicate, rename, and delete projects.
    - Automated snapshots and version restoration points.

15. **Centralized Export Center**:
    - Pre-flight quality control check (aspect ratio, resolution, print dimensions in inches and cm).
    - Smart file naming templates with variables: `{original}_{tool}_{width}x{height}_{ppi}ppi`.
    - Authentic physical print metadata injection:
      - **PNG**: `pHYs` chunk injection (11,811 pixels per meter = 300 PPI).
      - **JPEG**: JFIF APP0 segment injection (density units 1 = dots/inch, 300x300 DPI).
    - Multi-format download: SVG, Layered SVG, EPS 3.0, AutoCAD DXF, Print PDF 300 DPI, TIFF Press Master, Lossless PNG, Compressed JPG.

16. **Settings & Themes**:
    - Color Themes: Dark Mode, Light Mode, System.
    - 6 Accent Themes: Obsidian Indigo, Neon Cyan, Forest Emerald, Sunset Rose, Cyber Amber, Royal Purple.
    - Interface Density: Default, Compact, Comfortable.
    - Internationalization (i18n): English (en), Bangla (bn), Arabic (ar with dynamic RTL layout).

17. **SaaS Dashboard & Admin Console**:
    - User SaaS dashboard with recent projects, processing history, credit meter, and Quick Studio Launchpad.
    - Admin Console with platform analytics, user credit management, tool credit pricing, backup triggers, and live Maintenance Mode toggle.

---

## 🛠 Tech Stack & Architecture

- **Backend**: Node.js, Express, SQLite relational store with auto-migration, Multer, JSZip.
- **Frontend**: Vite, Modern Vanilla JavaScript, Custom Vanilla CSS Design System with CSS variables and glassmorphism.
- **Vector Engines**: Bézier Tracer with Hole Preservation, Color Quantizer, Potrace Algorithm, DXF & EPS PostScript 3.0 vector serializers.
- **Print Standards**: Physical pHYs & JFIF 300 PPI binary injection, TIFF PackBits encoder, PDF 1.4 vector stream generator.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
*(Executes 37 comprehensive unit and integration tests covering vector tracing, 300 PPI injection, print exporters, batch processing, presets, and database integrity).*

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Start Backend Production Server
```bash
npm run server
```
Open your browser at **`http://localhost:5000/`**.

---

## 📄 License
ISC License — CreativeForge AI Studio.
