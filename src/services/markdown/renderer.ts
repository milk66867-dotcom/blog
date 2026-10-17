// src/services/markdown/renderer.ts
import { unified } from '@astrojs/markdown-remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Heading, MediaAsset, MarkdownStyle } from '@/domain/types';
import { resolveMarkdownStyle } from './style-resolver';
import { rehypeCodePlugin } from './plugins/rehype-code';
import { rehypeImagePlugin } from './plugins/rehype-image';
import { rehypeMermaidPlugin } from './plugins/rehype-mermaid';

export interface RenderOptions {
    style?: MarkdownStyle;
    toc?: boolean;
    math?: boolean;
    mermaid?: boolean;
    codeCopy?: boolean;
    imageLightbox?: boolean;
}

export async function renderMarkdown(
    raw: string,
    options: RenderOptions = {}
): Promise<{ html: string; headings: Heading[]; media: MediaAsset[] }> {
    const headings: Heading[] = [];
    const media: MediaAsset[] = [];

    const processor = unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: false });

    if (options.math) {
        processor.use(remarkMath).use(rehypeKatex);
    }

    processor.use(rehypeCodePlugin, { copyable: options.codeCopy ?? true });
    processor.use(rehypeImagePlugin, {
        lightbox: options.imageLightbox ?? true,
        onMedia: (asset) => media.push(asset),
    });
    processor.use(rehypeMermaidPlugin, { enabled: options.mermaid ?? false });
    processor.use(rehypeStringify);

    // 提取 headings 的辅助插件
    processor.use(() => (tree) => {
        visit(tree, 'element', (node: any) => {
            if (/^h[1-6]$/.test(node.tagName)) {
                const depth = Number(node.tagName[1]);
                const text = extractText(node);
                const id = node.properties?.id ?? '';
                headings.push({ depth, slug: id, text });
            }
        });
    });

    const file = await processor.process(raw);
    const html = String(file);

    return {
        html,
        headings,
        media,
    };
}