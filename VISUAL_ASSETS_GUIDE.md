# Visual Assets Guide 🎨

## Design Constraints (NON-NEGOTIABLE)

### ✅ ALLOWED
- Static PNG/JPG backgrounds
- Lottie JSON animations
- SVG icons and UI elements
- PNG sprite sheets
- CSS/Canvas animations
- Framer Motion transitions

### ❌ FORBIDDEN
- 3D models (.obj, .fbx, .gltf)
- Unity/Unreal exports
- Spine animations
- Full-body character rigs
- Heavy MP4 videos (>5MB)
- WebGL shaders (complex)

## Required Assets

### 1. Backgrounds (Static Images)

#### Incident Alert Screen
- **File**: `public/images/bg-alert.jpg`
- **Size**: 1080x1920px (mobile portrait)
- **Style**: Dark, mystical, urgent atmosphere
- **Colors**: Deep purples, blues, hints of cyan
- **File Size**: < 200KB (optimized)

#### Containment Mission
- **File**: `public/images/bg-containment.jpg`
- **Size**: 1080x1920px
- **Style**: Energy grid, dimensional rift
- **Colors**: Electric blues, cyans, white energy
- **File Size**: < 200KB

#### Investigation Mission
- **File**: `public/images/bg-investigation.jpg`
- **Size**: 1080x1920px
- **Style**: Urban setting, mysterious
- **Colors**: Grays, purples, amber lighting
- **File Size**: < 200KB

#### Interception Mission
- **File**: `public/images/bg-interception.jpg`
- **Size**: 1080x1920px
- **Style**: Combat arena, dramatic
- **Colors**: Reds, purples, dark shadows
- **File Size**: < 200KB

### 2. Lottie Animations

#### Magic Spell Effects
- **File**: `public/animations/spell-attack.json`
- **Duration**: 0.5-1s
- **Style**: Energy projectile
- **File Size**: < 50KB

- **File**: `public/animations/spell-shield.json`
- **Duration**: 0.5s loop
- **Style**: Protective barrier
- **File Size**: < 50KB

- **File**: `public/animations/spell-bind.json`
- **Duration**: 1s
- **Style**: Chains/restraints
- **File Size**: < 50KB

- **File**: `public/animations/spell-drain.json`
- **Duration**: 1s
- **Style**: Energy absorption
- **File Size**: < 50KB

#### Success/Failure Indicators
- **File**: `public/animations/success.json`
- **Duration**: 2s
- **Style**: Celebratory, light burst
- **File Size**: < 30KB

- **File**: `public/animations/failure.json`
- **Duration**: 2s
- **Style**: Dark energy, corruption
- **File Size**: < 30KB

#### Aura Scan Effect
- **File**: `public/animations/aura-scan.json`
- **Duration**: 2s
- **Style**: Scanning wave, revealing colors
- **File Size**: < 40KB

### 3. UI Icons (SVG)

All icons should be:
- **Format**: SVG
- **Size**: 24x24px or 32x32px
- **Style**: Line art or simple fills
- **Colors**: Monochrome (colored via CSS)

#### Required Icons
- Energy (lightning bolt)
- Control (brain)
- Alignment (scales)
- Attack spell
- Shield spell
- Bind spell
- Drain spell
- Mission complete badge
- Alert icon
- Location pin

### 4. Sprite Sheets (Optional)

If using sprite animations:
- **Format**: PNG with transparency
- **Max Size**: 2048x2048px
- **Frame Size**: 256x256px per frame
- **Max Frames**: 16 frames
- **File Size**: < 500KB

## Color Palette

### Primary Colors
```css
--color-light: #fbbf24 (yellow-400)
--color-neutral: #9ca3af (gray-400)
--color-shadow: #a855f7 (purple-500)
--color-energy: #06b6d4 (cyan-500)
--color-control: #10b981 (emerald-500)
```

### Mission Type Colors
```css
--containment: #3b82f6 (blue-500)
--investigation: #f59e0b (amber-500)
--interception: #ef4444 (red-500)
```

### Background Gradients
```css
--bg-main: linear-gradient(to bottom, #1e1b4b, #581c87, #0f172a)
--bg-success: linear-gradient(to right, #34d399, #059669)
--bg-failure: linear-gradient(to right, #f87171, #dc2626)
```

## Animation Guidelines

### Framer Motion Transitions
```typescript
// Standard fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}

// Slide up
initial={{ y: 50, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.5 }}

// Scale bounce
initial={{ scale: 0.8 }}
animate={{ scale: 1 }}
transition={{ type: 'spring', stiffness: 200 }}
```

### Lottie Integration
```typescript
import Lottie from 'lottie-react';
import animationData from '@/public/animations/spell-attack.json';

<Lottie
  animationData={animationData}
  loop={false}
  autoplay={true}
  style={{ width: 200, height: 200 }}
/>
```

## Performance Requirements

### Mobile Optimization
- All images must be optimized (use TinyPNG, ImageOptim)
- Lottie files must be < 100KB total
- Target 60fps on iPhone 12 / Pixel 5
- No layout shifts (CLS < 0.1)
- First paint < 1.5s

### File Size Limits
- Background images: < 200KB each
- Lottie animations: < 50KB each
- SVG icons: < 5KB each
- Total assets: < 2MB

## Asset Creation Tools

### Recommended Software
- **Backgrounds**: Photoshop, Figma, Midjourney
- **Lottie**: After Effects + Bodymovin plugin
- **SVG Icons**: Figma, Illustrator, Inkscape
- **Optimization**: TinyPNG, SVGOMG, Squoosh

### Lottie Creation Tips
1. Keep compositions simple
2. Use shape layers, not images
3. Limit effects (no blur, glow)
4. Export at 30fps max
5. Test on mobile before finalizing

## Implementation Example

### Adding a Background
```typescript
// In component
<div 
  className="min-h-screen bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/bg-containment.jpg)' }}
>
  {/* Content */}
</div>
```

### Adding a Lottie Animation
```typescript
import Lottie from 'lottie-react';
import spellAttack from '@/public/animations/spell-attack.json';

function SpellEffect() {
  return (
    <Lottie
      animationData={spellAttack}
      loop={false}
      style={{ width: 150, height: 150 }}
    />
  );
}
```

### Adding SVG Icons
```typescript
// Direct inline
<svg className="w-6 h-6 text-cyan-400" fill="currentColor">
  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>

// Or from file
import EnergyIcon from '@/public/icons/energy.svg';
<EnergyIcon className="w-6 h-6" />
```

## Asset Checklist

Before launch, ensure:
- [ ] All backgrounds are < 200KB
- [ ] All Lottie files are < 50KB
- [ ] All SVG icons are optimized
- [ ] No 3D models or forbidden formats
- [ ] Animations run at 60fps on mobile
- [ ] Total asset bundle < 2MB
- [ ] All images have alt text
- [ ] Dark mode compatible
- [ ] Tested on iOS and Android

## Future Asset Needs

### Phase 2
- Character portraits (static PNG)
- More spell effects (Lottie)
- Environmental effects (Lottie)
- UI sound effects (MP3, < 50KB each)

### Phase 3
- Seasonal backgrounds
- Special event animations
- Guild emblems (SVG)
- Achievement badges (SVG)

---

**Remember**: Lightweight, web-optimized, mobile-first. Every asset must serve the gameplay experience without compromising performance.
