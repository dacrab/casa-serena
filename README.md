# Casa Serena

> *Serene House* — A cliffside estate above the caldera in Oia, Santorini.

A multi-page site for a fictional Santorini estate. The art direction — **Quiet Aegean Editorial** — pairs limestone and ink with terracotta, Instrument Serif display type, and full-bleed Cycladic photography. Built with Astro, styled with Tailwind CSS v4, animated with native CSS + IntersectionObserver (no animation library).

## Features

- Full-bleed video hero with layered contrast scrims and a staggered title reveal
- View Transitions for native cross-page navigation
- Scroll-reveal animations (IntersectionObserver + CSS, respecting `prefers-reduced-motion`)
- Sections: Hero, Intro, Suites, Gallery, Amenities, Testimonials, FAQ, Location, Enquire
- Native elements over custom widgets: `<dialog>` menus/lightbox, `<details>` FAQ, `<input type="date">` + `<select>` booking form
- Leaflet map with keyless OpenStreetMap tiles, muted in CSS to match the palette
- Art-directed WebP imagery via `astro:assets`
- Static site generation with sitemap + structured data

## Quick Start

```sh
bun install
bun dev          # http://localhost:4321
bun build        # outputs to ./dist/
```

## Stack

- **Astro** — Static site generator + View Transitions
- **Tailwind CSS v4** — Utility-first styling
- **Instrument Serif / Manrope** — Editorial display + sans pairing
- **Leaflet + OpenStreetMap** — Keyless location map
- **Vercel Analytics / Speed Insights** — Visitor tracking

## Structure

```
src/
├── assets/images/  # Art-directed WebP set
├── components/     # Page sections, nav, footer, enquiry form
├── data/           # suites.ts (suite copy + imagery)
├── layouts/        # Layout, PageLayout, LegalLayout
├── lib/            # site.ts (shared data), animations.ts (reveals)
├── pages/          # Six pages, legal, 404
├── scripts/        # Nav, gallery, testimonials, map, enquiry
└── styles/         # global.css (tokens, type, components)
```

## Deployment

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages).

---

**License**: MIT