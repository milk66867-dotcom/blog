// src/components/post/MarkdownStyleSwitcher.tsx
import { useEffect, useState } from 'react';
import { getMarkdownStyle, setMarkdownStyle } from '@/services/markdown-style';
import { markdownStyles } from '@/config/markdown-styles';
import type { MarkdownStyle } from '@/domain/types';

export default function MarkdownStyleSwitcher({ initialStyle }: { initialStyle?: MarkdownStyle }) {
    const [style, setStyleState] = useState<MarkdownStyle>(initialStyle || 'github');

    useEffect(() => {
        // 页面加载时，以本地存储为准（如果有）
        const saved = getMarkdownStyle();
        if (saved !== style) {
            setStyleState(saved);
            setMarkdownStyle(saved); // 应用样式
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStyle = e.target.value as MarkdownStyle;
        setStyleState(newStyle);
        setMarkdownStyle(newStyle);
    };

    return (
        <div className="flex items-center gap-2 text-sm text-tb-muted">
            <span>阅读样式:</span>
            <select
                value={style}
                onChange={handleChange}
                className="rounded border border-tb-border bg-tb-bg px-2 py-1 text-sm text-tb-fg outline-none focus:border-tb-primary"
            >
                {markdownStyles.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
        </div>
    );
}