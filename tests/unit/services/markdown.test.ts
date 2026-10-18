import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/services/markdown/renderer';

describe('renderMarkdown', () => {
    it('渲染标题和代码块', async () => {
        const md = '# Hello\n\n## World\n\n```js\nconst a = 1;\n```';
        const result = await renderMarkdown(md, { codeCopy: true });
        expect(result.html).toContain('<h1');
        expect(result.html).toContain('<h2');
        expect(result.html).toContain('data-copyable');
        expect(result.headings.length).toBe(2);
        expect(result.headings[0].depth).toBe(1);
    });

    it('数学公式', async () => {
        const md = '当 $a \ne 0$ 时，方程有解。';
        const result = await renderMarkdown(md, { math: true });
        expect(result.html).toContain('katex');
    });

    it('图片收集到 media', async () => {
        const md = '![demo](/images/posts/demo.webp)';
        const result = await renderMarkdown(md);
        expect(result.media.length).toBe(1);
        expect(result.media[0].path).toBe('/images/posts/demo.webp');
        expect(result.html).toContain('loading="lazy"');
    });
});