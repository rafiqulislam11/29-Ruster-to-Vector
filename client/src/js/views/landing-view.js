/**
 * CreativeForge AI — Public Marketing Landing Page & SEO Tool Showcase
 */
import { store } from '../state.js';

export class LandingView {
  constructor(container, onNavigateStudio) {
    this.container = container;
    this.onNavigateStudio = onNavigateStudio;
  }

  render(toolSlug = null) {
    if (toolSlug) {
      this.renderToolSeoPage(toolSlug);
      return;
    }

    this.container.innerHTML = `
      <div class="landing-container">
        <!-- TOP NAVIGATION -->
        <nav class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="nav-brand-home">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">AI Creative Studio</span>
            </div>
          </div>

          <div class="landing-nav-links">
            <a href="#features" class="landing-nav-link">Features</a>
            <a href="#tools" class="landing-nav-link">Creative Tools</a>
            <a href="#pricing" class="landing-nav-link">Pricing</a>
            <a href="#faq" class="landing-nav-link">FAQ</a>
            <span class="landing-nav-link" id="nav-open-dashboard" style="cursor:pointer;">User Dashboard</span>
            <span class="landing-nav-link" id="nav-open-admin" style="cursor:pointer; color:var(--accent-tertiary);">Admin Panel</span>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <button class="btn btn-primary" id="btn-hero-launch">Launch Creative Studio</button>
          </div>
        </nav>

        <!-- HERO SECTION -->
        <header class="hero-section">
          <div class="hero-glow-bg"></div>
          <div class="hero-badge">
            <span class="badge badge-indigo">✦ Next-Generation Creative Architecture</span>
          </div>
          <h1 class="hero-headline">
            Transform Images Into Professional Creative Assets
          </h1>
          <p class="hero-subheadline">
            AI-powered image enhancement, gradients, glass effects, vector conversion and icon creation — all in one unified, non-destructive creative workspace.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" id="btn-hero-start">Start Creating Free</button>
            <button class="btn btn-glass btn-lg" id="btn-hero-explore">Explore Studio Suite</button>
          </div>

          <!-- Interactive Workspace Showcase Mockup -->
          <div class="hero-preview-frame">
            <div style="background:var(--bg-tertiary); padding:10px 16px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-subtle);">
              <div style="display:flex; gap:6px;">
                <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
                <div style="width:10px; height:10px; border-radius:50%; background:#f59e0b;"></div>
                <div style="width:10px; height:10px; border-radius:50%; background:#10b981;"></div>
              </div>
              <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">creativeforge.ai/studio/workspace</span>
              <span class="badge badge-cyan">LIVE STUDIO PREVIEW</span>
            </div>
            <div style="padding:24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">⬡</div>
                <strong style="font-size:0.9rem;">Authentic Vector SVG</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Raster to pure &lt;path&gt; nodes</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">❄</div>
                <strong style="font-size:0.9rem;">Fractal Glass Shaders</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">6 Refractive crystal distortion presets</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">⚡</div>
                <strong style="font-size:0.9rem;">AI Multi-Scale Upscaler</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">2K to 8K resolution synthesis</p>
              </div>
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; text-align:center;">
                <div style="font-size:1.8rem; margin-bottom:8px;">📦</div>
                <strong style="font-size:0.9rem;">Icon Pack Generator</strong>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">8 styles + Multi-size ZIP download</p>
              </div>
            </div>
          </div>
        </header>

        <!-- FEATURES SECTION -->
        <section class="features-section" id="features">
          <div class="section-header">
            <span class="badge badge-cyan" style="margin-bottom:8px;">Creative Architecture</span>
            <h2 class="section-title">One Image. Infinite Creative Assets.</h2>
            <p class="section-subtitle">
              Upload once. The non-destructive pipeline preserves your source asset while generating vectors, gradients, film grain, and icon packages simultaneously.
            </p>
          </div>

          <div class="features-grid" id="tools">
            <div class="feature-card" data-seo-tool="image-to-vector">
              <div class="feature-card-icon">⬡</div>
              <h3 class="feature-card-title">Image → Vector (SVG)</h3>
              <p class="feature-card-desc">
                High-precision contour extraction with Bézier curve smoothing that generates valid, lightweight, infinite-resolution SVG paths.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Vector Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="image-upscaler">
              <div class="feature-card-icon">⚡</div>
              <h3 class="feature-card-title">AI Image Upscaler</h3>
              <p class="feature-card-desc">
                Upscale graphics to 2K, 4K, 6K, and 8K with high-frequency unsharp masking, texture recovery, and modular AI API abstraction.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Upscaler Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="fractal-glass">
              <div class="feature-card-icon">❄</div>
              <h3 class="feature-card-title">Fractal Glass (6 Presets)</h3>
              <p class="feature-card-desc">
                Soft transparent glass, crystalline refractions, fractured shards, fine fractals, and layered dispersion shaders.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Glass Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="gradient-maker">
              <div class="feature-card-icon">◈</div>
              <h3 class="feature-card-title">Gradient Maker & Extractor</h3>
              <p class="feature-card-desc">
                Dominant color harmony extraction, mesh orbs, multi-color palettes, and organic textured lighting systems.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Gradient Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="background-remover">
              <div class="feature-card-icon">✂</div>
              <h3 class="feature-card-title">Remove White Background</h3>
              <p class="feature-card-desc">
                Intelligent color distance detection, smooth edge feathering, and contact shadow preservation for pure transparent cutouts.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Cutout Tool →</button>
            </div>

            <div class="feature-card" data-seo-tool="icon-pack-maker">
              <div class="feature-card-icon">📦</div>
              <h3 class="feature-card-title">Icon Sheet & Pack Maker</h3>
              <p class="feature-card-desc">
                Transform any artwork into 8 icon styles (Outline, Flat, 3D, Gradient, Rounded) and package into multi-resolution ZIP archives.
              </p>
              <button class="btn btn-secondary btn-sm" style="align-self:flex-start;">Open Icon Pack Tool →</button>
            </div>
          </div>
        </section>

        <!-- PRICING SECTION -->
        <section class="pricing-section" id="pricing">
          <div class="section-header">
            <span class="badge badge-indigo" style="margin-bottom:8px;">Transparent SaaS Pricing</span>
            <h2 class="section-title">Scale Your Creative Velocity</h2>
            <p class="section-subtitle">Flexible credit plans tailored for creators, studios, and engineering teams.</p>
          </div>

          <div class="pricing-grid">
            <div class="pricing-card">
              <span class="pricing-name">Free Starter</span>
              <div class="pricing-price">$0 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Essential creative tools for exploration</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 10 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 2K Max Resolution</li>
                <li class="pricing-feature-item">✓ Watermark-Free Preview</li>
                <li class="pricing-feature-item">✓ 3 Active Projects</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-free">Get Started</button>
            </div>

            <div class="pricing-card">
              <span class="pricing-name">Creator</span>
              <div class="pricing-price">$19 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">For designers and visual content creators</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 100 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 4K Ultra HD Export</li>
                <li class="pricing-feature-item">✓ All Fractal Glass Presets</li>
                <li class="pricing-feature-item">✓ Batch Processing</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-creator">Upgrade to Creator</button>
            </div>

            <div class="pricing-card featured">
              <div style="position:absolute; top:12px; right:16px;">
                <span class="badge badge-indigo">MOST POPULAR</span>
              </div>
              <span class="pricing-name">Professional</span>
              <div class="pricing-price">$49 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Full creative suite for production agencies</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 500 Monthly Credits</li>
                <li class="pricing-feature-item">✓ 8K Master Resolution</li>
                <li class="pricing-feature-item">✓ SVG Vector Tracing & Export</li>
                <li class="pricing-feature-item">✓ Full Icon Pack ZIP Studio</li>
                <li class="pricing-feature-item">✓ High-Speed Queue Priority</li>
              </ul>
              <button class="btn btn-primary" id="btn-plan-pro">Launch Professional</button>
            </div>

            <div class="pricing-card">
              <span class="pricing-name">Business Studio</span>
              <div class="pricing-price">$129 <span class="pricing-period">/ month</span></div>
              <p style="font-size:0.8rem; color:var(--text-secondary);">High volume enterprise infrastructure</p>
              <ul class="pricing-features">
                <li class="pricing-feature-item">✓ 2,500 Monthly Credits</li>
                <li class="pricing-feature-item">✓ Unlimited Projects</li>
                <li class="pricing-feature-item">✓ Dedicated AI Compute</li>
                <li class="pricing-feature-item">✓ Automated Nightly Backups</li>
              </ul>
              <button class="btn btn-secondary" id="btn-plan-business">Contact Sales</button>
            </div>
          </div>
        </section>

        <!-- FAQ SECTION -->
        <section class="seo-tool-faq" id="faq">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          <div class="faq-item">
            <div class="faq-question">How does non-destructive editing work in CreativeForge?</div>
            <div class="faq-answer">
              When you upload an image, CreativeForge stores the original file in secure immutable storage. Any tool operation (vectors, gradients, glass effects) renders in isolated layers without modifying the original source. You can create 20 different asset variations from a single upload.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Are exported SVGs true vector paths?</div>
            <div class="faq-answer">
              Yes! Unlike basic editors that embed base64 PNGs into SVG files, CreativeForge's Vectorizer analyzes contours and generates authentic mathematical &lt;path&gt; Bézier curves that can be opened and edited in Figma, Adobe Illustrator, or Inkscape.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Can I connect external AI models like Replicate or Stability AI?</div>
            <div class="faq-answer">
              Yes. CreativeForge includes a modular AIProvider abstraction layer on the backend. You can provide your API key in the environment configuration to route requests to cloud AI models seamlessly.
            </div>
          </div>
        </section>
      </div>
    `;

    this.bindEvents();
  }

  /**
   * Dedicated SEO Landing Page for Flagship Tools
   */
  renderToolSeoPage(slug) {
    const seoContent = {
      'image-to-vector': {
        title: 'Image to Vector (SVG) Converter Online',
        tagline: 'Authentic Vector Path Tracing Engine',
        desc: 'Convert JPG, PNG, and WEBP raster images into infinite-resolution SVG vectors with color quantization and Bézier curve smoothing.',
        toolId: 'tool_vector_convert',
        faqs: [
          { q: 'What is the advantage of SVG vector tracing?', a: 'SVG files can be scaled to billboard size without losing any sharpness or crispness.' },
          { q: 'Can I edit the vector paths in Illustrator or Figma?', a: 'Yes, all paths are exported as standard SVG path elements.' }
        ]
      },
      'image-upscaler': {
        title: 'AI Image Upscaler & Resolution Enhancer',
        tagline: '2K, 4K, 6K, and 8K Resolution Synthesis',
        desc: 'Enlarge low-resolution photos and illustrations without pixelation using high-frequency edge reconstruction and noise reduction.',
        toolId: 'tool_upscaler',
        faqs: [
          { q: 'What resolutions are supported?', a: 'You can upscale images up to 8K Cinema (7680 x 4320).' },
          { q: 'Does it preserve fine textures?', a: 'Yes, the high-frequency unsharp mask preserves subtle surface details.' }
        ]
      },
      'fractal-glass': {
        title: 'Fractal Glass & Refractive Distortion Studio',
        tagline: '6 Procedural Crystalline Shader Presets',
        desc: 'Create ultra-modern glassmorphism effects, crystal refractions, fractured polygonal shards, and chromatic dispersion.',
        toolId: 'tool_fractal_glass_1',
        faqs: [
          { q: 'How many presets are available?', a: 'CreativeForge features 6 unique glass engines from Soft Glass to Abstract Dispersion.' }
        ]
      },
      'gradient-maker': {
        title: 'AI Image to Gradient & Mesh Palette Generator',
        tagline: 'Multi-Color Linear, Radial, and Fluid Mesh Gradients',
        desc: 'Extract color harmony from uploaded photos or synthesize beautiful CSS & SVG mesh gradients with organic lighting.',
        toolId: 'tool_gradient_extract',
        faqs: [
          { q: 'Can I export gradients as CSS?', a: 'Yes, you can export CSS linear gradients, radial gradients, or download high-res PNGs.' }
        ]
      },
      'background-remover': {
        title: 'Remove White & Custom Backgrounds Intelligently',
        tagline: 'Precision Alpha Cutouts with Shadow Preservation',
        desc: 'Isolate subjects and logos with smooth feathering and subtle contact shadow retention.',
        toolId: 'tool_bg_remove_white',
        faqs: [
          { q: 'Does it support transparent PNG export?', a: 'Yes, all cutouts are exported as lossless transparent PNGs.' }
        ]
      },
      'icon-pack-maker': {
        title: 'Icon Pack Maker & Icon Sheet Generator',
        tagline: '8 Visual Styles + Multi-Resolution ZIP Package',
        desc: 'Generate complete icon sets with Outline, Flat, 3D, Gradient, and Monochrome styling bundled with SVGs and PNGs in a single ZIP.',
        toolId: 'tool_icon_pack',
        faqs: [
          { q: 'What sizes are included in the ZIP pack?', a: '64px, 128px, 256px, and 512px PNGs plus master SVGs and presentation sheets.' }
        ]
      }
    };

    const data = seoContent[slug] || seoContent['image-to-vector'];

    this.container.innerHTML = `
      <div class="landing-container">
        <nav class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="nav-brand-seo">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">AI Creative Studio</span>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-seo-launch">Launch Studio</button>
        </nav>

        <div class="seo-tool-header">
          <div class="seo-tool-tagline">${data.tagline}</div>
          <h1 style="font-size:2.8rem; font-weight:800; margin-bottom:16px;">${data.title}</h1>
          <p style="font-size:1.1rem; color:var(--text-secondary); max-width:720px; margin:0 auto 28px;">
            ${data.desc}
          </p>
          <button class="btn btn-primary btn-lg" id="btn-seo-open-tool">Open ${data.title.split(' ')[0]} in Studio →</button>
        </div>

        <section class="seo-tool-faq">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          ${data.faqs.map(f => `
            <div class="faq-item">
              <div class="faq-question">${f.q}</div>
              <div class="faq-answer">${f.a}</div>
            </div>
          `).join('')}
        </section>
      </div>
    `;

    this.container.querySelector('#nav-brand-seo').onclick = () => this.render(null);
    this.container.querySelector('#btn-seo-launch').onclick = () => this.onNavigateStudio();
    this.container.querySelector('#btn-seo-open-tool').onclick = () => {
      store.setState({ activeTool: data.toolId });
      this.onNavigateStudio();
    };
  }

  bindEvents() {
    const launch = () => this.onNavigateStudio();

    this.container.querySelectorAll('#btn-hero-launch, #btn-hero-start, #btn-hero-explore, #btn-plan-pro, #btn-plan-free, #btn-plan-creator, #btn-plan-business').forEach(b => {
      b.onclick = launch;
    });

    const dashBtn = this.container.querySelector('#nav-open-dashboard');
    if (dashBtn) {
      dashBtn.onclick = () => store.setState({ currentView: 'dashboard' });
    }

    const adminBtn = this.container.querySelector('#nav-open-admin');
    if (adminBtn) {
      adminBtn.onclick = () => store.setState({ currentView: 'admin' });
    }

    // Feature card click to SEO page
    this.container.querySelectorAll('[data-seo-tool]').forEach(card => {
      card.onclick = () => {
        const slug = card.getAttribute('data-seo-tool');
        this.render(slug);
      };
    });
  }
}
