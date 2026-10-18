import type { Post, SiteConfig } from '@/domain/types';
import { joinUrl } from '@/domain/utils';

export function buildSitemap(
    staticPages: string[],
    posts: Post[],
    site: SiteConfig
): string {
    const urls = [
        ...staticPages,
        ...posts.map((p) => p.url),
    ];

    const entries = urls
        .map((path) => {
            const loc = joinUrl(site.url, path);
            return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}