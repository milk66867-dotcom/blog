// src/components/admin/AdminApp.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import matter from 'gray-matter';
import { renderMarkdown } from '@/services/markdown/renderer';
import { saveDraft, listDrafts, deleteDraft } from '@/infra/storage/indexed-db';
import type { Draft, PostFrontmatter } from '@/domain/types';

export default function AdminApp() {
    const [markdown, setMarkdown] = useState('# Hello\n\n开始编写你的文章...');
    const [html, setHtml] = useState('');
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [currentDraftId, setCurrentDraftId] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. 加载草稿列表
    const refreshDrafts = async () => {
        const list = await listDrafts();
        // 按更新时间倒序
        setDrafts(list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    };

    useEffect(() => {
        refreshDrafts();
    }, []);

    // 2. 实时渲染 Markdown 预览
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                // 借用你写好的渲染服务
                const res = await renderMarkdown(markdown, { codeCopy: true, imageLightbox: true });
                setHtml(res.html);
            } catch (e) {
                console.error('渲染失败', e);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [markdown]);

    // 3. 解析文件 (拖拽或选择)
    const parseFile = async (file: File) => {
        const text = await file.text();
        setMarkdown(text);
        setCurrentDraftId(''); // 导入新文件时重置 ID
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.mdx'))) {
            await parseFile(file);
        } else {
            alert('请拖入 .md 或 .mdx 文件');
        }
    };

    // 4. 保存草稿
    const handleSaveDraft = async () => {
        const id = currentDraftId || `draft-${Date.now()}`;

        // 提取 frontmatter 和正文
        let title = '无标题草稿';
        try {
            const parsed = matter(markdown);
            title = parsed.data.title || title;
        } catch { }

        const newDraft: Draft = {
            id,
            title,
            content: markdown,
            frontmatter: {}, // 这里可以把 gray-matter 解析出的 data 存进去
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await saveDraft(newDraft);
        setCurrentDraftId(id);
        await refreshDrafts();
        alert('草稿已保存');
    };

    // 5. 加载与删除草稿
    const handleLoadDraft = (draft: Draft) => {
        setMarkdown(draft.content);
        setCurrentDraftId(draft.id);
    };

    const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('确定删除此草稿吗？')) return;
        await deleteDraft(id);
        if (currentDraftId === id) setCurrentDraftId('');
        await refreshDrafts();
    };

    // 6. 导出为 .md 文件
    const handleExport = () => {
        // 👇 用原生 JS 生成 yyyy-MM-dd 格式的日期
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `post-${dateStr}.md`; // 👈 使用刚刚生成的 dateStr
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <div className="flex h-full gap-6">
            {/* 左侧边栏：草稿箱与导入 */}
            <div className="flex w-64 flex-col gap-4 shrink-0">
                {/* 拖拽区 / 文件选择 */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragging ? 'border-tb-primary bg-tb-primary/10' : 'border-tb-border hover:border-tb-primary/50'
                        }`}
                >
                    <input
                        type="file"
                        accept=".md,.mdx"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) parseFile(file);
                        }}
                    />
                    <p className="text-sm text-tb-muted">点击或拖拽 .md 文件到这里</p>
                </div>

                {/* 草稿列表 */}
                <div className="flex-1 overflow-y-auto rounded-lg border border-tb-border bg-tb-bg">
                    <div className="border-b border-tb-border bg-tb-border/20 p-3 text-sm font-semibold">本地草稿箱</div>
                    <ul>
                        {drafts.map((d) => (
                            <li
                                key={d.id}
                                onClick={() => handleLoadDraft(d)}
                                className={`flex cursor-pointer items-center justify-between border-b border-tb-border p-3 text-sm hover:bg-tb-border/20 ${currentDraftId === d.id ? 'bg-tb-primary/10' : ''
                                    }`}
                            >
                                <div className="truncate pr-2">
                                    <div className="font-medium truncate">{d.title}</div>
                                    <div className="text-xs text-tb-muted">
                                        {new Date(d.updatedAt).toLocaleString('zh-CN', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }).replace(/\//g, '-')}
                                    </div>
                                </div>
                                <button onClick={(e) => handleDeleteDraft(d.id, e)} className="text-red-500 hover:text-red-700">
                                    ×
                                </button>
                            </li>
                        ))}
                        {drafts.length === 0 && <li className="p-4 text-center text-sm text-tb-muted">暂无草稿</li>}
                    </ul>
                </div>
            </div>

            {/* 中间：编辑器 */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-tb-border">
                <div className="flex items-center justify-between border-b border-tb-border bg-tb-border/20 px-4 py-2">
                    <span className="text-sm font-semibold">Markdown 编辑</span>
                    <div className="flex gap-2">
                        <button onClick={handleSaveDraft} className="rounded bg-tb-primary px-3 py-1 text-sm text-white hover:opacity-90">
                            保存草稿
                        </button>
                        <button onClick={handleExport} className="rounded border border-tb-border px-3 py-1 text-sm hover:bg-tb-border/40">
                            导出 .md
                        </button>
                    </div>
                </div>
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="flex-1 resize-none bg-tb-bg p-4 font-mono text-sm outline-none"
                    placeholder="在此输入 Markdown 内容..."
                />
            </div>

            {/* 右侧：预览 */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-tb-border bg-tb-bg">
                <div className="border-b border-tb-border bg-tb-border/20 px-4 py-2">
                    <span className="text-sm font-semibold">实时预览</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>
        </div>
    );
}