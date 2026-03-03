// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://airbnb-swart-nu.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com'],
  },
});
