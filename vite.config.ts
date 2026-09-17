import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site needs '/openqr/'; Cloudflare/root deploys use '/'.
  // Set PAGES_BASE=/openqr/ in the Pages workflow (see .github/workflows/deploy.yml).
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react(), tailwindcss()],
});
