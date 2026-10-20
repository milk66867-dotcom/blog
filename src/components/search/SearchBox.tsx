// src/components/search/SearchBox.tsx
import { useEffect, useState, useRef } from 'react';
import { searchAdapter, type SearchResult } from '@/services/search';
import { createPortal } from 'react-dom';

export default function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDev, setIsDev] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. 初始化 & 快捷键监听
    useEffect(() => {
        setIsDev(import.meta.env.DEV);
        searchAdapter.init();

        const handleKeyDown = (e: KeyboardEvent) => {
            // 打开弹窗：Ctrl+K 或 按 /
            if ((e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k') || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))) {
                e.preventDefault();
                setIsOpen(true);
            }
            // 关闭弹窗：Escape
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 2. 打开弹窗时自动聚焦
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = 'hidden'; // 锁定背景滚动
        } else {
            setQuery('');
            setResults([]);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // 3. 防抖搜索
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            const res = await searchAdapter.search(query);
            setResults(res);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <>
            {/* 导航栏上的触发按钮（保留在原位） */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-md border border-tb-border bg-tb-bg/50 px-3 py-1.5 text-sm text-tb-muted hover:text-tb-fg hover:bg-tb-border/40 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">搜索</span>
                <kbd className="hidden rounded bg-tb-border/50 px-1.5 py-0.5 text-[10px] font-mono sm:inline">
                    Ctrl K
                </kbd>
            </button>

            {/* 👇 搜索弹窗通过 createPortal 传送到 body 的末尾 */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[10vh] backdrop-blur-sm sm:pt-[15vh]">
                    {/* 点击遮罩关闭 */}
                    <div className="fixed inset-0" onClick={() => setIsOpen(false)}></div>

                    {/* 弹窗本体：加上明确的 bg-white dark:bg-[#0a0a0a] 确保不透明 */}
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-tb-border bg-white dark:bg-[#0a0a0a] shadow-2xl">
                        {/* 输入区 */}
                        <div className="flex items-center border-b border-tb-border px-4 py-3">
                            <svg className="mr-3 h-5 w-5 text-tb-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="搜索文章..."
                                className="w-full bg-transparent text-base text-tb-fg outline-none placeholder:text-tb-muted"
                            />
                            <button onClick={() => setIsOpen(false)} className="ml-2 rounded p-1 text-tb-muted hover:bg-tb-border/40">
                                <kbd className="text-xs">ESC</kbd>
                            </button>
                        </div>

                        {/* 结果区 */}
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {isDev && (
                                <p className="p-4 text-center text-sm text-amber-500">
                                    开发环境下不支持搜索，请运行 <code>npm run build && npm run preview</code> 测试。
                                </p>
                            )}
                            {!isDev && query && results.length === 0 && !isLoading && (
                                <p className="p-8 text-center text-tb-muted">没有找到与 "{query}" 相关的文章</p>
                            )}
                            {isLoading && (
                                <p className="p-8 text-center text-tb-muted animate-pulse">正在搜索...</p>
                            )}
                            {!isLoading && results.length > 0 && (
                                <ul className="divide-y divide-tb-border/50">
                                    {results.map((item) => (
                                        <li key={item.url}>
                                            <a
                                                href={item.url}
                                                onClick={() => setIsOpen(false)}
                                                className="block rounded-lg px-4 py-3 hover:bg-tb-border/40 transition-colors"
                                            >
                                                <h4 className="font-medium text-tb-primary">{item.title}</h4>
                                                <p
                                                    className="mt-1 text-sm text-tb-muted line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!query && !isDev && (
                                <p className="p-8 text-center text-sm text-tb-muted">输入关键词开始搜索...</p>
                            )}
                        </div>
                    </div>
                </div>,
                document.body // 挂载点
            )}
        </>
    );
}