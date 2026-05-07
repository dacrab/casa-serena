// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://casa-serena.vercel.app',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  vite: {
    // @ts-ignore — false positive from duplicate vite type declarations (astro internal vs @tailwindcss/vite)
    plugins: [tailwindcss()],
  },
});
