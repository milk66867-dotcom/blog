import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
    test: {
        // 启用全局 API，这样 vi.mock 就能更早生效
        globals: true,
        environment: 'node',
    },
    resolve: {
        alias: {
            // // 1. 核心：将 astro:content 重定向到 Astro 自动生成的点目录类型文件
            // 'astro:content': path.resolve(
            //     path.dirname(fileURLToPath(import.meta.url)),
            //     './.astro/content.d.ts'
            // ),
            // 2. 确保你的 @/ 别名也能被 Vitest 正确解析
            '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
        },
    },
});
