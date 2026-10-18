import { visit } from 'unist-util-visit';
import type { MediaAsset } from '@/domain/types';

export function rehypeImagePlugin(options: {
    lightbox: boolean;
    onMedia: (asset: MediaAsset) => void;
}) {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            if (node.tagName === 'img') {
                node.properties = node.properties || {};
                node.properties.loading = 'lazy';
                node.properties.decoding = 'async';
                if (options.lightbox) {
                    node.properties['data-lightbox'] = 'true';
                }

                const src = node.properties.src ?? '';
                options.onMedia({
                    id: src,
                    type: 'image',
                    path: src,
                    alt: node.properties.alt ?? undefined,
                    mime: 'image/*',
                });
            }
        });
    };
}