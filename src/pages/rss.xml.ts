// src/pages/rss.xml.ts
import type { APIRoute } from 'astro';
import { getAllPosts } from '@/services/content';
import { buildRss } from '@/services/seo';
import { siteConfig } from '@/config/site.config';

export const GET: APIRoute = async () => {
    const posts = await getAllPosts(); // 获取按日期倒序的文章
    const xml = await buildRss(posts, siteConfig);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            // 建议在 CDN 缓存 1 小时
            'Cache-Control': 'public, max-age=3600',
        },
    });
};