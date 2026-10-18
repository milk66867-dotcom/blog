import { visit } from 'unist-util-visit';

export function rehypeCodePlugin(options: { copyable: boolean }) {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            if (node.tagName === 'pre' && options.copyable) {
                node.properties = node.properties || {};
                node.properties['data-copyable'] = 'true';
            }
        });
    };
}