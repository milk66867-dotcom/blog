// src/components/layout/ThemeToggle.tsx
import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/services/theme';
import type { Theme } from '@/domain/types';

export default function ThemeToggle() {
    const [theme, setThemeState] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setThemeState(getTheme());
    }, []);

    const handleChange = (newTheme: Theme) => {
        setTheme(newTheme);
        setThemeState(newTheme);
    };

    if (!mounted) return <div className="w-8 h-8" />; // 占位防跳动

    return (
        <button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-tb-border text-tb-muted hover:text-tb-fg hover:bg-tb-border/40"
            onClick={() => {
                const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
                handleChange(next);
            }}
            title={`当前主题: ${theme}`}
        >
            {theme === 'light' && '☀️'}
            {theme === 'dark' && '🌙'}
            {theme === 'system' && '💻'}
        </button>
    );
}