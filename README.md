# Casa Serena

> **Casa Serena** — Spanish/Italian for *"Serene House"* or *"Peaceful Home"*. A name that captures the stillness of waking up to the sea, where luxury and calm exist in perfect balance.

Luxury beachfront estate website. Built with [Astro](https://astro.build), styled with scoped CSS, animated with [GSAP](https://gsap.com).

## Stack

- **Framework** — Astro 5 (static output)
- **Animations** — GSAP + ScrollTrigger
- **Fonts** — Cormorant Garamond, DM Sans (Google Fonts)
- **Images** — Astro Image (optimized WebP via Unsplash)
- **SEO** — Open Graph, Twitter Card, JSON-LD structured data, sitemap

## Structure

```
src/
├── components/
│   ├── Nav.astro          # Fixed navbar + mobile overlay
│   ├── Hero.astro         # Hero, marquee strip, intro section
│   ├── About.astro        # About section + stat counters
│   ├── Gallery.astro      # Horizontal scroll gallery + lightbox
│   ├── Amenities.astro    # Amenity list (data-driven)
│   ├── Quote.astro        # Pull quote + animated stat counters
│   ├── Location.astro     # Location map context + distances
│   ├── Enquire.astro      # Contact form + footer
│   └── PageScripts.astro  # All GSAP / ScrollTrigger logic
├── layouts/
│   └── Layout.astro       # HTML shell, global styles, SEO meta
└── pages/
    ├── index.astro        # Page orchestrator (~50 lines)
    └── 404.astro
public/
├── favicon.svg            # Brand CS monogram (SVG, preferred)
└── favicon.ico            # Brand CS monogram (ICO, fallback)
```

## Commands

| Command           | Action                                |
| :---------------- | :------------------------------------ |
| `bun install`     | Install dependencies                  |
| `bun dev`         | Start dev server at `localhost:4321`  |
| `bun build`       | Build production site to `./dist/`   |
| `bun preview`     | Preview production build locally      |
| `bun astro check` | Type-check all `.astro` files         |

## Development

```sh
bun install
bun dev
```

The dev server supports HMR. GSAP animations are disabled for users with `prefers-reduced-motion`.

## Deployment

The site builds to a static `dist/` directory — deploy to any static host (Netlify, Vercel, Cloudflare Pages, etc).

```sh
bun build
# upload dist/ to your host
```
