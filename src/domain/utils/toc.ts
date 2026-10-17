import type { Heading, TOCItem } from '@/domain/types';

export function buildToc(headings: Heading[]): TOCItem[] {
    const root: TOCItem[] = [];
    const stack: { item: TOCItem; depth: number }[] = [];

    for (const h of headings) {
        if (h.depth < 2 || h.depth > 6) continue;
        const item: TOCItem = { id: h.slug, text: h.text, depth: h.depth, children: [] };

        while (stack.length && stack[stack.length - 1].depth >= h.depth) {
            stack.pop();
        }

        if (!stack.length) {
            root.push(item);
        } else {
            const parent = stack[stack.length - 1].item;
            parent.children = parent.children ?? [];
            parent.children.push(item);
        }

        stack.push({ item, depth: h.depth });
    }

    return root;
}