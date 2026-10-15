// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { postSchema } from './domain/schemas/post.schema';

// 博客文章集合：读取 src/content/posts/ 下的所有 md/mdx 文件
const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: postSchema, // 复用你 domain/schemas/post.schema.ts 里定义的 schema
});

// 独立页面集合：读取 src/content/pages/ 下的文件
const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        lastUpdated: z.coerce.date().optional(),
    }),
});

// ⚠️ 必须是具名导出，且 collections 是一个对象（record）
export const collections = { posts, pages };