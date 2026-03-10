// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://casa-serena.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
