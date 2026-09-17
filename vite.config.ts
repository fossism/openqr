import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Project site: https://fossism.github.io/openqr/
  base: '/openqr/',
  plugins: [react(), tailwindcss()],
});
