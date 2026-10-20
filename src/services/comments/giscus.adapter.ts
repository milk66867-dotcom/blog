// src/services/comments/giscus.adapter.ts
import type { CommentAdapter } from './comment.adapter';
import type { CommentConfig, Theme } from '@/domain/types';

export class GiscusAdapter implements CommentAdapter {
    private container: HTMLElement | null = null;

    mount(container: HTMLElement, config: CommentConfig, theme: Theme): void {
        if (!config.enabled) return;
        this.container = container;

        // 清空容器（防止 React 严格模式重复挂载）
        container.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';

        // 注入配置
        script.setAttribute('data-repo', config.repo);
        script.setAttribute('data-repo-id', config.repoId);
        script.setAttribute('data-category', config.category);
        script.setAttribute('data-category-id', config.categoryId);
        script.setAttribute('data-mapping', config.mapping);
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', config.reactionsEnabled ? '1' : '0');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', config.inputPosition);
        script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
        script.setAttribute('data-lang', config.lang);

        container.appendChild(script);
    }

    updateTheme(theme: Theme): void {
        // Giscus 支持通过 postMessage 动态切换主题
        const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
        if (!iframe || !iframe.contentWindow) return;

        iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } } },
            'https://giscus.app'
        );
    }
}

export const giscusAdapter = new GiscusAdapter();