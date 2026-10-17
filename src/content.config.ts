// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
    PostFrontmatterSchema,
    PageFrontmatterSchema,
} from './domain/schemas';

const posts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: PostFrontmatterSchema,
});

const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: PageFrontmatterSchema,
});

export const collections = { posts, pages };