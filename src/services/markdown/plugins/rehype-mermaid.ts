import { visit } from 'unist-util-visit';

export function rehypeMermaidPlugin(options: { enabled: boolean }) {
    return (tree: any) => {
        if (!options.enabled) return;
        visit(tree, 'element', (node: any) => {
            if (
                node.tagName === 'pre' &&
                node.children?.[0]?.properties?.className?.includes?.('language-mermaid')
            ) {
                node.properties = node.properties || {};
                node.properties['data-mermaid'] = 'true';
            }
        });
    };
}