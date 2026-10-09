---
name: Levantine Editorial Warmth
colors:
  surface: '#fdf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fdf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e6e2d9'
  on-surface: '#1c1c16'
  on-surface-variant: '#444842'
  inverse-surface: '#31302b'
  inverse-on-surface: '#f4f0e7'
  outline: '#757872'
  outline-variant: '#c5c7c0'
  surface-tint: '#586155'
  primary: '#161e15'
  on-primary: '#ffffff'
  primary-container: '#2b3329'
  on-primary-container: '#939b8e'
  inverse-primary: '#c0c9bb'
  secondary: '#546251'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4ce'
  on-secondary-container: '#596655'
  tertiary: '#261a06'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2f19'
  on-tertiary-container: '#aa9679'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce5d6'
  primary-fixed-dim: '#c0c9bb'
  on-primary-fixed: '#161e15'
  on-primary-fixed-variant: '#41493e'
  secondary-fixed: '#d8e7d1'
  secondary-fixed-dim: '#bccbb5'
  on-secondary-fixed: '#121f11'
  on-secondary-fixed-variant: '#3d4a3a'
  tertiary-fixed: '#f7dfbf'
  tertiary-fixed-dim: '#d9c3a4'
  on-tertiary-fixed: '#251a06'
  on-tertiary-fixed-variant: '#54442d'
  background: '#fdf9f0'
  on-background: '#1c1c16'
  surface-variant: '#e6e2d9'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 68px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 50px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: '0'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  title-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-caps:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system embodies the serene hospitality, slow-living luxury, and intellectual craft of an upscale Lebanese roastery and café concept. The aesthetic blends Levantine architectural heritage—rendered through soft plaster arch silhouettes and artisanal khayzaran cane geometry—with contemporary high-fashion editorial rigor.

The UI avoids cluttered commercial tropes in favor of spacious, museum-grade calm. Tactile warmth, Mediterranean light, and bespoke culinary poise define every interaction. The user experience evokes stepping onto cool limestone flags beneath dappled olive grove shade: unhurried, fragrant, grounded, and unmistakably premium.

## Colors

The palette is strictly calibrated around five foundational hues supported by deep culinary contrast tones:

- **Canvas & Envelope (`#f6f2e9` - Warm Ivory):** The atmospheric base across all viewports. Replaces stark paper white with the tactile texture of raw linen and sun-dried lime plaster.
- **Primary Ink & Structure (`#2b3329` - Deep Olive Charcoal):** The primary reading ink, sharp structural strokes, and high-emphasis controls. Provides editorial authority without the sterile hardness of pure black.
- **Contrast Depth (`#1a2219` - Forest Dark):** Reserved for hero narrative typography, high-impact buttons, and dark-toned night cards (e.g., private cellar or reserve roast modules).
- **Secondary Botanical (`#aab9a4` - Soft Sage):** Evokes wild mountain za’atar and olive groves. Utilized for interactive hover states, secondary tags, and subtle backdrop surfaces.
- **Atmospheric Fill (`#dde5d9` - Pastel Sage):** Tonal surface fills, badge backdrops, table headers, and quiet architectural card dividers.
- **Wood Accents (`#d7c1a2` - Pale Wood):** Reflects blonde cedar and hand-woven cane webbing. Used for secondary borders, table dividers, and subtle active underlines.
- **Pale Stone (`#d8d3c8`):** Serves as an unassertive structural delimiter for thin borders, subtle cards, and form field outlines.
- **Gilded Brass (`#c29b62`):** Used strictly as a micro-accent (roaster batch seals, origin indicators, reservation badges, and active tab indicators).

## Typography

The typographic system contrasts **Playfair Display** (editorial literary gravitas, reminiscent of Beirut’s golden publishing and intellectual salon era) with **Manrope** (clean, geometric humanist clarity for optimal menu legibility, order flow, and nutritional detail).

- Headings use Playfair Display set with intentional letter spacing: tight negative tracking for oversized hero titles, standard tracking for subheadings. Headings never use weights above 500 to preserve their classical lyricism.
- `label-caps` must always be transformed to uppercase, functioning as provenance labels (e.g., `ORIGIN: BATROUN`, `ROAST LEVEL 3`, `SINGLE ESTATE`).
- Body text maintains relaxed line heights (1.6 to 1.65 ratio) to support slow editorial engagement rather than hurried scanning.

## Layout & Spacing

The layout is built upon an architectural 12-column grid on desktop screens (max container width: 1320px) transitioning into a 6-column grid on tablet, and a single-column or dual-card split on mobile.

- **Editorial Rhythm:** Generous vertical sections punctuated by 48px to 96px whitespace pauses. Content blocks breathe with museum proportions rather than dense e-commerce stacking.
- **Canter Margins:** Large screen layouts use 48px outer margins; mobile displays compress margins strictly to 20px (`1.25rem`) to maximize card area while maintaining ivory framing.
- **Asymmetric Offsets:** Roastery narratives, featured mezza platters, and single-origin profiles leverage off-center 7/5 column pairings to maintain an artisan editorial cadence.

## Elevation & Depth

Depth in this system avoids heavy digital drop shadows. Instead, it relies on tactile material realism: low-contrast stone outlines, warm tonal stratification, and whispered ambient diffusion.

- **Plaster Surface Tiering:** Elevation 0 rests directly on `#f6f2e9` (Warm Ivory). Elevation 1 (deli cards, ordering items) utilizes `#ffffff` or `#dde5d9` (Pastel Sage) with a 1px boundary of `#d8d3c8` (Pale Stone).
- **Mediterranean Sun Bleach Shadow:** When cards lift on hover, use an extra-soft, warm olive diffusion:
  `box-shadow: 0 12px 32px -8px rgba(43, 51, 41, 0.07);`
- **Floating Overlays & Sticky Bars:** Modals, checkout drawers, and navigation ribbons employ subtle frosted backdrop blur (`backdrop-filter: blur(12px)`) combined with 90% opacity Warm Ivory (`rgba(246, 242, 233, 0.90)`), banded by a single 1px hairline border of `#d7c1a2`.

## Shapes

The geometric signature is grounded in understated softness, derived from smoothed limestone and hand-molded stucco. Standard interface controls, cards, and input fields use subtle softened geometry (`0.25rem` to `0.5rem`).

- **Architectural Arch Motifs:** Distinctive visual components (featured roastery bags, signature cocktail imagery, location showcases) incorporate a rounded arched top (`border-radius: 999px 999px 0 0` or asymmetric `border-radius: 4rem 4rem 0.25rem 0.25rem`) nodding to historical Lebanese triple-arched arcades.
- **Pill Badges:** Small status chips and provenance pills retain a circular radius (`999px`) to contrast against sharp typographic baselines.

## Components

### Buttons
- **Primary:** Solid `#2b3329` (Deep Olive Charcoal) with `#f6f2e9` text. Hover transitions to `#1a2219`. Min height 48px, horizontal padding `1.75rem`, `border-radius: 0.25rem`. Typography is `label-lg` uppercase with wide tracking.
- **Secondary (Woodline):** Transparent background with a 1px border of `#d7c1a2` and `#2b3329` text. Hover fills with `#dde5d9` and transitions border to `#aab9a4`.
- **Tertiary (Brass Monastic):** Text-only link in `#2b3329` with a subtle bottom border in `#c29b62` (Warm Brass) that expands from the center on hover.

### Menu & Product Cards
- **Deli & Bottle Retail Cards:** Set on pure white or `#dde5d9` with a 1px `#d8d3c8` border. Imagery is framed within an arched mask (`border-radius: 3rem 3rem 0.25rem 0.25rem`). Pricing is set in `headline-sm` Playfair Display; tasting notes in `body-sm` Manrope.
- **Tasting Flight & Mezza Trays:** Horizontal card layout utilizing khayzaran-cane-textured SVG divider hairlines between culinary courses.

### Chips & Provenance Tags
- Compact labels (`label-caps`) with 6px vertical and 12px horizontal padding.
- Base background: `#dde5d9` with `#2b3329` text.
- Special reserve chips: `#f6f2e9` background with a 1px border in `#c29b62` and brass-tinted text.

### Form Inputs & Selectors
- Background: `#f6f2e9` (recessed into page) or pure white with a 1px border of `#d8d3c8`.
- Focus state: Border transitions to `#2b3329` with zero high-glow rings; replaces the focus halo with a clean 1px interior keyline.
- Floating labels set in `label-caps` in `#2b3329` muted at 60% opacity.

### Checkboxes & Radio Controls
- Circular for radio, slightly softened (`2px`) for checkboxes.
- Border: 1.5px `#2b3329`. Checked state is filled with `#2b3329` displaying a Warm Ivory checkmark or inner dot.

### Roastery Cupping Note Badges
- Small circular geometric stamps featuring aromatic notes (e.g., "Cardamom", "Orange Blossom", "Smoked Fig") outlined in `#aab9a4` with central icons rendered in warm line work.