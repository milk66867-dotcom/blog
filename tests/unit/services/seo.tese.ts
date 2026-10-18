import { describe, it, expect } from 'vitest';
import { buildSitemap } from '@/services/seo/sitemap.service';
import { buildRss } from '@/services/seo/rss.service';

describe('buildSitemap', () => {
    it('包含所有 URL', () => {
        const xml = buildSitemap(
            ['/', '/posts'],
            [{ url: '/posts/hello', /* ... */ } as any],
            { url: 'https://example.com' } as any
        );
        expect(xml).toContain('https://example.com/');
        expect(xml).toContain('https://example.com/posts/hello');
        expect(xml).toContain('<urlset');
    });
});

describe('buildRss', () => {
    it('生成合法 RSS', async () => {
        const xml = await buildRss([/* ... */], {
            title: 'Test',
            description: 'Desc',
            url: 'https://example.com',
            language: 'zh-CN',
        } as any);
        expect(xml).toContain('<rss');
        expect(xml).toContain('<channel>');
    });
});