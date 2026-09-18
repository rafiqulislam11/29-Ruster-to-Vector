/**
 * CreativeForge AI — Creative Presets & Template Library
 * Curated professional configurations for Vector Studio, Film Grain, Fractal Glass, and Gradients.
 */

export const PresetsLibrary = {
  vector: [
    {
      id: 'vec_minimal_icon',
      name: '✦ Minimalist Icon',
      desc: 'Super clean 2-color vector silhouettes with maximum curve smoothing',
      icon: '🎨',
      params: { vectorColors: 2, vectorDetail: 35, vectorSmoothness: 85, vectorRemoveWhite: true }
    },
    {
      id: 'vec_vintage_stamp',
      name: '📜 Vintage Stamp',
      desc: 'Distressed edge contours with classic 4-color letterpress print vibe',
      icon: '🏛️',
      params: { vectorColors: 4, vectorDetail: 75, vectorSmoothness: 25, vectorRemoveWhite: true }
    },
    {
      id: 'vec_high_contrast',
      name: '⚡ High-Contrast Logo',
      desc: 'Bold vector geometry tuned for modern branding and typography',
      icon: '💎',
      params: { vectorColors: 3, vectorDetail: 85, vectorSmoothness: 70, vectorRemoveWhite: true }
    },
    {
      id: 'vec_technical_cad',
      name: '📐 Technical Blueprint',
      desc: 'Micro-precision contour lines suitable for laser cutting and CAD export',
      icon: '📐',
      params: { vectorColors: 2, vectorDetail: 100, vectorSmoothness: 15, vectorRemoveWhite: false }
    },
    {
      id: 'vec_pop_art',
      name: '🌈 Pop Art Screenprint',
      desc: 'Rich 16-color layered chromatic vectors inspired by Warhol screenprints',
      icon: '✨',
      params: { vectorColors: 16, vectorDetail: 80, vectorSmoothness: 55, vectorRemoveWhite: false }
    }
  ],

  grain: [
    {
      id: 'grain_portra400',
      name: '🎞️ Kodak Portra 400',
      desc: 'Fine, warm natural skin-tone grain with subtle organic contrast',
      icon: '📷',
      params: { amount: 20, size: 1.1, contrast: 45 }
    },
    {
      id: 'grain_ilford_hp5',
      name: '🖤 Ilford HP5+ B&W',
      desc: 'Dramatic high-acutance silver halide grain with bold punchy blacks',
      icon: '🎞️',
      params: { amount: 42, size: 1.5, contrast: 68 }
    },
    {
      id: 'grain_cinestill',
      name: '🌃 CineStill 800T',
      desc: 'Tungsten cinema stock texture with atmospheric halation noise',
      icon: '🎬',
      params: { amount: 32, size: 1.3, contrast: 52 }
    },
    {
      id: 'grain_super8',
      name: '📼 Vintage Super 8mm',
      desc: 'Heavy retro 70s home-movie grit with chunky analog imperfections',
      icon: '📹',
      params: { amount: 68, size: 2.2, contrast: 78 }
    },
    {
      id: 'grain_velvia50',
      name: '🌄 Fuji Velvia 50',
      desc: 'Ultra-micro crystalline structure with vibrant tonal saturation',
      icon: '🖼️',
      params: { amount: 12, size: 0.9, contrast: 85 }
    }
  ],

  glass: [
    {
      id: 'glass_frosted_fluted',
      name: '🧊 Frosted Fluted Glass',
      desc: 'Gentle architectural reeded glass with soft light diffusion',
      icon: '🏛️',
      params: { preset: '1', intensity: 35, tint: '#ffffff' }
    },
    {
      id: 'glass_diamond_prism',
      name: '💎 Diamond Prism Refraction',
      desc: 'Crystalline geometric facets with chromatic dispersion',
      icon: '💠',
      params: { preset: '2', intensity: 65, tint: '#99f6e4' }
    },
    {
      id: 'glass_liquid_ripple',
      name: '🌊 Liquid Water Ripple',
      desc: 'Smooth organic fluid refractions resembling running water',
      icon: '💧',
      params: { preset: '3.1', intensity: 48, tint: '#38bdf8' }
    },
    {
      id: 'glass_cyber_mesh',
      name: '⚡ Cyber Abstract Wave',
      desc: 'Deep multi-layer mathematical voronoi distortion',
      icon: '🔮',
      params: { preset: '3.2', intensity: 75, tint: '#818cf8' }
    },
    {
      id: 'glass_shattered_crystal',
      name: '💥 Shattered Crystal Prism',
      desc: 'High-impact fractured glass geometry with chromatic aberration',
      icon: '✨',
      params: { preset: '3.3', intensity: 90, tint: '#f43f5e' }
    }
  ],

  gradient: [
    {
      id: 'grad_aurora',
      name: '🌌 Aurora Borealis',
      desc: 'Deep cosmic blues fading into luminous emerald and cyan glows',
      icon: '🌠',
      type: 'mesh',
      colors: ['#09203f', '#537895', '#00f2fe', '#4facfe']
    },
    {
      id: 'grad_neon_sunset',
      name: '🌅 Cyber Sunset',
      desc: 'Electric crimson, solar orange, and deep indigo dusk gradient',
      icon: '🌇',
      type: 'linear',
      colors: ['#f83600', '#f9d423', '#b92b27', '#1565c0']
    },
    {
      id: 'grad_velvet_pastel',
      name: '🌸 Velvet Dream',
      desc: 'Soft lilac, baby blue, and blush pink silk aesthetic',
      icon: '🪻',
      type: 'soft',
      colors: ['#e0c3fc', '#8ec5fc', '#fbc2eb', '#a6c1ee']
    },
    {
      id: 'grad_matrix',
      name: '🟢 Cyberpunk Matrix',
      desc: 'Abyssal navy background radiating vivid neon emerald light',
      icon: '💻',
      type: 'radial',
      colors: ['#000428', '#004e92', '#00f260', '#0575e6']
    }
  ]
};
