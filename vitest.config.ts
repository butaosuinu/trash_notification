import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer/src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/renderer/src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'out'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/test/**',
        'src/**/__tests__/**',
        'src/**/types/**',
        'src/renderer/src/main.tsx',
        'src/preload/**',
        'src/main/index.ts',
        'src/main/ipc/**',
        'src/renderer/src/stores/settingsAtom.ts',
      ],
    },
  },
});
