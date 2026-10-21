// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import { fileURLToPath } from 'node:url'; // 1. 引入必要的文件路径工具

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // 2. 将 @/ 映射到项目的 src 目录
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },

  integrations: [react(), mdx()],

  build: {
    inlineStylesheets: 'auto',
  },
});