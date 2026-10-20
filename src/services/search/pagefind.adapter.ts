// src/services/search/pagefind.adapter.ts
import type { SearchAdapter, SearchResult } from './search.adapter';

// Pagefind 的全局类型声明
declare global {
    interface Window {
        pagefind?: any;
    }
}

export class PagefindAdapter implements SearchAdapter {
    private pagefind: any = null;
    private isDev = import.meta.env.DEV;

    async init(): Promise<void> {
        if (this.isDev) {
            console.warn('[Search] 开发环境不支持 Pagefind 搜索，请运行 npm run build && npm run preview');
            return;
        }

        try {
            // 👇 关键：把路径赋给变量，彻底绕过 Vite 的静态分析
            const pagefindPath = '/pagefind/pagefind.js';

            this.pagefind = await import(/* @vite-ignore */ pagefindPath);
            await this.pagefind.init();
        } catch (e) {
            console.error('Pagefind 初始化失败，可能未生成索引', e);
        }
    }

    async search(query: string, options?: { limit?: number }): Promise<SearchResult[]> {
        if (this.isDev) {
            // 开发环境返回空，或者返回一个警告
            return [];
        }
        if (!this.pagefind) {
            await this.init();
        }
        if (!this.pagefind || !query.trim()) return [];

        const search = await this.pagefind.search(query);
        const limit = options?.limit || 10;

        // 加载前 limit 个结果的详细数据
        const results = await Promise.all(
            search.results.slice(0, limit).map(async (result: any) => {
                const data = await result.data();
                return {
                    url: data.url,
                    title: data.meta.title || '无标题',
                    excerpt: data.excerpt,
                    anchors: data.anchors || [],
                };
            })
        );

        return results;
    }
}

export const searchAdapter = new PagefindAdapter();