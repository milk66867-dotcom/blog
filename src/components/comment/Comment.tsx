// src/components/comment/Comment.tsx
import { useEffect, useRef, useState } from 'react';
import { giscusAdapter } from '@/services/comments';
import { siteConfig } from '@/config/site.config';

export default function Comment() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!containerRef.current || mounted) return;

        const getTheme = () => (document.documentElement.dataset.theme as 'light' | 'dark') || 'light';

        // 挂载评论
        giscusAdapter.mount(containerRef.current, siteConfig.comments, getTheme());
        setMounted(true);

        // 监听主题变化
        const handleThemeChange = () => {
            giscusAdapter.updateTheme(getTheme());
        };
        window.addEventListener('techblog:theme-change', handleThemeChange);

        return () => {
            window.removeEventListener('techblog:theme-change', handleThemeChange);
        };
    }, []);

    if (!siteConfig.comments.enabled) return null;

    return (
        <div className="mt-12">
            <h2 className="mb-6 text-xl font-semibold">评论</h2>
            <div ref={containerRef} />
        </div>
    );
}