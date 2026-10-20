// src/components/markdown/CodeBlock.tsx
import { useEffect } from 'react';

export default function CodeBlock() {
    useEffect(() => {
        const containers = document.querySelectorAll<HTMLElement>('[data-code-copy="true"]');
        const cleanups: Array<() => void> = [];

        containers.forEach((container) => {
            const pres = container.querySelectorAll<HTMLPreElement>('pre[data-copyable]');

            pres.forEach((pre) => {
                if (pre.dataset.copyAttached === 'true') return;
                pre.dataset.copyAttached = 'true';
                pre.style.position = 'relative';

                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = '复制';
                button.setAttribute('aria-label', '复制代码');
                button.className =
                    'absolute right-2 top-2 rounded border border-tb-border bg-tb-bg/90 px-2 py-1 text-xs text-tb-muted opacity-0 transition-opacity hover:text-tb-fg focus:opacity-100';

                pre.addEventListener('mouseenter', () => {
                    button.style.opacity = '1';
                });
                pre.addEventListener('mouseleave', () => {
                    button.style.opacity = '0';
                });

                const onClick = async () => {
                    const code = pre.querySelector('code')?.innerText ?? '';
                    try {
                        await navigator.clipboard.writeText(code);
                        button.textContent = '已复制';
                    } catch {
                        button.textContent = '复制失败';
                    }
                    window.setTimeout(() => {
                        button.textContent = '复制';
                    }, 1500);
                };

                button.addEventListener('click', onClick);
                pre.appendChild(button);

                cleanups.push(() => {
                    button.removeEventListener('click', onClick);
                    button.remove();
                    delete pre.dataset.copyAttached;
                });
            });
        });

        return () => {
            cleanups.forEach((fn) => fn());
        };
    }, []);

    return null;
}