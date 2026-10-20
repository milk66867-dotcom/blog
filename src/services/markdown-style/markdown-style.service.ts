import type { MarkdownStyle } from '@/domain/types';

const STYLE_KEY = 'techblog:md-style';

export function getMarkdownStyle(): MarkdownStyle {
    if (typeof localStorage === 'undefined') return 'github';
    return (localStorage.getItem(STYLE_KEY) as MarkdownStyle) || 'github';
}

export function setMarkdownStyle(style: MarkdownStyle): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STYLE_KEY, style);
    applyMarkdownStyle(style);
}

export function applyMarkdownStyle(style: MarkdownStyle): void {
    if (typeof document === 'undefined') return;
    const article = document.getElementById('post-content');
    if (article) {
        // 移除旧的 md-style-* 类，添加新的
        Array.from(article.classList).forEach((cls) => {
            if (cls.startsWith('md-style-')) article.classList.remove(cls);
        });
        article.classList.add(`md-style-${style}`);
        article.dataset.mdStyle = style;
    }
    window.dispatchEvent(new CustomEvent('techblog:md-style-change', { detail: style }));
}