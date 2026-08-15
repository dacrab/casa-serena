# Casa Serena

> *Serene House* — A luxury beachfront estate website showcasing minimalist design and elegant animations.

A multi-page site for a fictional Santorini estate. Built with Astro, styled with Tailwind CSS v4, animated with native CSS + IntersectionObserver (no animation library).

## Features

- Video hero with CSS marquee strip
- View Transitions for native cross-page navigation
- Scroll-reveal animations (IntersectionObserver + CSS, respecting `prefers-reduced-motion`)
- Sections: About, Gallery, Amenities, Location, Contact
- Native elements over custom widgets: `<dialog>` menus/lightbox, `<details>` FAQ, `<input type="date">` + `<select>` booking form
- Leaflet map (CSS bundled locally, no CDN)
- Optimized images (WebP via `astro:assets`)
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
- **Leaflet** — Location map
- **Vercel Analytics / Speed Insights** — Visitor tracking

## Structure

```
src/
├── components/     # Nav, Hero, PageHero, Gallery, Enquire, etc.
├── layouts/        # Layout (HTML shell + ClientRouter), LegalLayout
├── lib/            # site.ts (shared data), animations.ts (reveals)
├── pages/          # index, about, suites, experiences, gallery, legal
└── styles/         # global.css (Tailwind theme + custom styles)
```

## Deployment

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages).

---

**License**: MIT