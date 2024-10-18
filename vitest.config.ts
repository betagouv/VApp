import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'tests-playwright/*']
  }
});
