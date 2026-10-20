import type { Theme } from '@/domain/types';

const THEME_KEY = 'techblog:theme';

export function getTheme(): Theme {
    if (typeof localStorage === 'undefined') return 'system';
    return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
}

export function setTheme(theme: Theme): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const resolvedTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = theme; // 记录用户的选择（light/dark/system）

    // 派发事件，通知其他组件
    window.dispatchEvent(new CustomEvent('techblog:theme-change', { detail: resolvedTheme }));
}

export function watchSystemTheme(): void {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addEventListener('change', () => {
        // 只有当前偏好是 system 时，才跟随系统变化
        if (getTheme() === 'system') {
            applyTheme('system');
        }
    });
}

// 防闪烁内联脚本（必须作为字符串注入到 <head> 中）
export function getInlineThemeScript(): string {
    return `
    (function () {
      try {
        var stored = localStorage.getItem('techblog:theme') || 'system';
        var resolved = stored === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : stored;
        document.documentElement.dataset.theme = resolved;
        document.documentElement.dataset.themePreference = stored;
      } catch (e) {
        document.documentElement.dataset.theme = 'light';
      }
    })();
  `;
}