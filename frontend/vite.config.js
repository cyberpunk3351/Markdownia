import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || 'http://localhost:5000/api';

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      postcss: path.resolve(__dirname, 'postcss.config.cjs'),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiBase.replace(/\/api$/, ''),
          changeOrigin: true,
        },
      },
    },
  };
});
