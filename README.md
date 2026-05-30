# Casa Serena

> *Serene House* — A luxury beachfront estate website showcasing minimalist design and elegant animations.

A single-page portfolio site for a fictional Santorini estate. Built with Astro, styled with Tailwind CSS, animated with GSAP.

## Features

- Video hero with marquee strip
- Responsive sections: About, Gallery, Amenities, Location, Contact
- Smooth scroll animations
- Mobile-friendly navigation
- Optimized images (WebP)
- Static site generation

## Quick Start

```sh
bun install
bun dev          # http://localhost:4321
bun build        # outputs to ./dist/
```

## Stack

- **Astro** — Static site generator
- **Tailwind CSS** — Utility-first styling
- **GSAP** — Scroll animations
- **Vercel Analytics** — Visitor tracking

## Structure

```
src/
├── components/     # Nav, Hero, About, Gallery, etc.
├── layouts/        # HTML shell
├── pages/          # index.astro
└── styles/         # global.css (Tailwind config)
```

## Deployment

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages).

---

**License**: MIT
