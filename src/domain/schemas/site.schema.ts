import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const MarkdownStyleSchema = z.enum([
    'github', 'juejin', 'vue', 'tech-dark', 'magazine', 'minimal',
]);

export const SiteConfigSchema = z.object({
    version: z.object({
        schemaVersion: z.string(),
        contentVersion: z.string(),
        updatedAt: z.string().datetime({ offset: true }),
    }),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(300),
    url: z.string().url(),
    base: z.string().regex(/^\/.*\/$|^\/$/).default('/'),
    language: z.string().default('zh-CN'),
    author: z.object({
        name: z.string().min(1).max(50),
        avatar: z.string().optional(),
        bio: z.string().max(200).optional(),
        email: z.string().email().optional(),
        url: z.string().url().or(z.string().regex(/^\//, '必须是完整的 URL 或以 / 开头的相对路径')).optional(),
    }),
    navigation: z.array(z.object({
        label: z.string().min(1).max(20),
        href: z.string(),
        icon: z.string().optional(),
        external: z.boolean().default(false),
        order: z.number().int(),
        visible: z.boolean().default(true),
    })),
    socialLinks: z.array(z.object({
        platform: z.string(),
        label: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
    })).default([]),
    defaultTheme: ThemeSchema.default('system'),
    defaultMarkdownStyle: MarkdownStyleSchema.default('github'),
    particle: z.object({
        enabled: z.boolean().default(true),
        density: z.number().min(10).max(200).default(60),
        speed: z.number().min(0).max(5).default(0.6),
        linkDistance: z.number().min(50).max(300).default(120),
        interactive: z.boolean().default(true),
        mobileEnabled: z.boolean().default(false),
        respectReducedMotion: z.boolean().default(true),
        colorLight: z.string().default('#0ea5e9'),
        colorDark: z.string().default('#22d3ee'),
        fpsThreshold: z.number().min(15).max(60).default(30),
    }),
    seo: z.object({
        titleTemplate: z.string(),
        defaultDescription: z.string(),
        defaultOgImage: z.string(),
        keywords: z.array(z.string()).default([]),
    }),
    comments: z.object({
        enabled: z.boolean().default(true),
        provider: z.literal('giscus'),
        repo: z.string(),
        repoId: z.string(),
        category: z.string(),
        categoryId: z.string(),
        mapping: z.enum(['pathname', 'url', 'title', 'og:title']).default('pathname'),
        reactionsEnabled: z.boolean().default(true),
        inputPosition: z.enum(['top', 'bottom']).default('bottom'),
        theme: z.string().default('preferred_color_scheme'),
        lang: z.string().default('zh-CN'),
    }),
    analytics: z.object({
        enabled: z.boolean().default(true),
        provider: z.literal('cloudflare'),
        token: z.string(),
    }),
    pagination: z.object({
        pageSize: z.number().int().min(1).max(50).default(10),
    }),
    integrations: z.object({
        search: z.object({ provider: z.literal('pagefind'), enabled: z.boolean().default(true) }),
        comments: z.object({ provider: z.literal('giscus'), enabled: z.boolean().default(true) }),
        analytics: z.object({ provider: z.literal('cloudflare'), enabled: z.boolean().default(true) }),
        cms: z.object({ provider: z.literal('decap'), enabled: z.boolean().default(false) }),
    }),
    license: z.string().max(100).optional(),
});