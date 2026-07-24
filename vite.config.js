import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@features': path.resolve(__dirname, './src/components/features'),
      '@dialogs': path.resolve(__dirname, './src/components/dialogs'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@sdk': path.resolve(__dirname, './src/sdk'),
    },
  },
});
