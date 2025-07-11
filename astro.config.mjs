/*
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  // your config here
});
*/

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://morerain.vercel.app',
  output: 'static',
  integrations: [
    svelte()
  ],
});
