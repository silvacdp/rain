import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://your-site.com',
  output: 'static',
  integrations: [
    svelte()
  ],
});
