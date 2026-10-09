# GIBRAN & CO.

Fine dining site for a Lebanese café concept, migrated from a single static
`code.html` (Tailwind CDN) to **Next.js 15** with a layered animation stack.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | `next@15.5.26` (App Router) | Static prerender, image optimisation, React 19 |
| Language | `typescript@5.7` (`strict`) | — |
| Styling | `tailwindcss@3.4` + `@tailwindcss/forms` | Same design tokens as the original |
| Component animation | `framer-motion@13.4` | Declarative reveal / presence / layout animations |
| Scroll animation | `gsap@3.12` + `ScrollTrigger` | Parallax, scroll-scrubbed transforms |
| Smooth scrolling | `lenis@1.3` | Inertial scrolling, driven by the GSAP ticker |
| Video encoding | `ffmpeg-static@5.2` (dev) | Rebuilds the plate clip via `npm run video` |

> **Note on `framer-motion`:** it was pinned to `12.4.7` first, whose
> `motion-dom: ^12.4.5` range resolved to `12.43.0` — a build that had dropped
> internals the old version imports, which broke the webpack build. Upgrading to
> `13.4.4` pairs `framer-motion` with `motion-dom@13.4.4` correctly.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static production build
npm start         # serve the production build
npm run lint
npm run typecheck
npm run video     # re-encode public/video/cake.mp4 from the frames
```

Node **18.18+** is required by this Next version.

## The pinned journey section

`components/journey.tsx` is a `348vh` section with a `sticky top-0 h-screen` panel.
Scroll progress drives four text slides that cross-swap — all sharing one CSS
grid cell, so the layout never shifts — and the indicator's progress hairline.

The plate beside the copy is a **seamlessly looping video**
(`components/journey-plate.tsx`), not a scroll-scrubbed frame sequence. It is
`muted loop playsInline autoplay`, which is the combination browsers permit to
autoplay without a user gesture. `public/video/cake.mp4` is 2.08s / 452 KB and
crossfaded so it can cycle indefinitely; `public/Exquisite/ezgif-frame-011.jpg`
is its poster, chosen because it is the exact still the clip opens on.

If autoplay is refused (low-power mode, data saver) the poster and gradient
ground stay put and nothing shifts. Under `prefers-reduced-motion` the video is
paused on its poster rather than looping.

### The clip does not loop natively

`public/cake.mp4` is the client's 10.01s master — a **montage**, not one shot: a
wide sauce-pour, then tight close-ups from other angles. Measured with ffmpeg's
`psnr`: `ezgif-frame-001.jpg` matches `t=0` at 53.3 dB, so the old frame
sequence was literally the head of this file. Only the opening wide shot suits
this layout, which sets copy on the left and the plate on the right.

Its loop does not close either — last frame vs first is ~10.4 dB, well below a
normal step. `scripts/make-video.mjs` therefore builds the clip to end on the
frame it begins from: the output runs the body, then crossfades its tail into
the head, finishing on frame 10 and wrapping to frame 11, a one-frame step.
Verified at **27.05 dB** wrap against 24.54 dB for a normal step.

Encoded with a keyframe every 12 frames (`-g 12`) rather than the default, plus
`+faststart` and no audio track. Rebuild with `npm run video`.

> Only `ezgif-frame-011.jpg` is still referenced. The other 59 frames in
> `public/Exquisite/` are the source the video was cut from and are no longer
> loaded by the site — safe to delete if you want them out of the deploy.

## Structure

```
app/
layout.tsx        fonts (next/font), metadata, providers, skip link
page.tsx          section composition
globals.css       tokens, component classes, Lenis + reduced-motion rules
components/
smooth-scroll-provider.tsx   Lenis + ScrollTrigger wiring, useSmoothScroll()
motion-primitives.tsx        Reveal, SplitText, Magnetic, shared easing
parallax.tsx                 GSAP Parallax + ScrollReveal
scroll-progress.tsx          brass scroll-progress bar
marquee.tsx                  infinite ticker (pauses on hover)
header.tsx  hero.tsx  pillars.tsx  journey.tsx
signature-dishes.tsx  taste-the-difference.tsx
mood-section.tsx  info-strip.tsx  footer.tsx  icons.tsx
lib/data.ts         all copy + menu/pillar/dish content
public/images/      images pulled down from the original hotlinks
```

## What changed beyond the port

- **Images are local.** The original hotlinked `lh3.googleusercontent.com`;
all nine files now live in `public/images/` and go through `next/image`
(AVIF/WebP, responsive `sizes`, LCP-priority on the hero).
- **Fonts are self-hosted.** `next/font/google` downloads and subsets the five
families at build time — no render-blocking Google request, no layout shift.
- **The dish carousel actually works.** The original arrows had no handlers.
It is now a keyboard-navigable, snap-scrolling carousel with a progress rail.
- **The menu tabs actually filter.** The original only toggled button styling.
Each of the five categories now swaps in real menu items via `AnimatePresence`,
with a shared `layoutId` pill animating between tabs.
- **Scroll-spy nav.** Header links highlight the section in view via
`IntersectionObserver`, and the bar hides on scroll-down / returns on
scroll-up.
- **Motion is scroll-linked**, not just on-load: hero and background plates
parallax against scroll, the journey section drives a slide counter, and the
stats count up on entry.

## Accessibility

- Every animation opts out under `prefers-reduced-motion: reduce` — the Lenis
instance is never constructed, GSAP/parallax is skipped, `SplitText` renders
plain text, counters jump to their final value, and the marquee stops.
A global CSS guard collapses remaining transitions.
- Menu tabs are a real `tablist` (`role`, `aria-selected`, `aria-controls`).
- The carousel is a labelled `region` with `aria-roledescription="carousel"`.
- Skip link, focus-visible states, and `sr-only` stat labels.

## Original files

`code.html` and `screen.png` are kept for reference; nothing imports them.
`DESIGN.md` remains the source of truth for the palette and type scale.


## Repository Signals
- Project Root: stitch_gibran_co._lebanese_cafe (2)
- Total Safe Files Analyzed: 30
- Dependencies: 18 packages
- Configured Scripts: 6 commands
- Tracked Commits: 0 recent commits
