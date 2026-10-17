import { z } from 'zod';

export const MarkdownStyleSchema = z.enum([
    'github',
    'juejin',
    'vue',
    'tech-dark',
    'magazine',
    'minimal',
]);

export const PostFrontmatterSchema = z.object({
    title: z.string().min(1).max(200),
    // date: z.string().datetime(),
    date: z.string().datetime({ offset: true }),
    // updated: z.string().datetime().optional(),
    updated: z.string().datetime({ offset: true }).optional(),
    tags: z.array(z.string().min(1).max(30)).max(20).default([]),
    category: z.string().min(1).max(30).default('未分类'),
    cover: z.string().optional(),
    summary: z.string().max(500).optional(),
    draft: z.boolean().default(false),
    style: MarkdownStyleSchema.optional(),
    pinned: z.boolean().default(false),
    toc: z.boolean().default(true),
    comments: z.boolean().default(true),
    math: z.boolean().default(false),
    mermaid: z.boolean().default(false),
    author: z.string().max(50).optional(),
    license: z.string().max(100).optional(),
    description: z.string().max(300).optional(),
    keywords: z.array(z.string().max(30)).max(20).optional(),
    ogImage: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export const PageFrontmatterSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(300).optional(),
    updated: z.string().datetime().optional(),
    draft: z.boolean().default(false),
    toc: z.boolean().default(false),
    comments: z.boolean().default(false),
});