// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getAllPosts } from '@/services/content';
import { buildSitemap } from '@/services/seo';
import { siteConfig } from '@/config/site.config';

export const GET: APIRoute = async () => {
    const posts = await getAllPosts();

    // 手动列出所有静态页面路径
    const staticPages = [
        '/',
        '/posts',
        '/tags',
        '/categories',
        '/archive',
        '/about',
    ];

    const xml = buildSitemap(staticPages, posts, siteConfig);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
};