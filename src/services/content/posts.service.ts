// src/services/content/posts.service.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Post } from '@/domain/types';
import { renderMarkdown } from '@/services/markdown/renderer';
import { buildSeo } from '@/services/seo/seo.service';
import {
    buildToc,
    calcReadingTime,
    countWords,
    truncate,
    slugFromFilename,
} from '@/domain/utils';
import { siteConfig } from '@/config/site.config';

// ---------- 内部：entry → Post ----------

async function entryToPost(entry: CollectionEntry<'posts'>): Promise<Post> {
    const fm = entry.data;
    const slug = fm.slug ?? slugFromFilename(entry.id);
    const url = `/posts/${slug}`;

    const rendered = await renderMarkdown(entry.body ?? '', {
        style: fm.style,
        math: fm.math,
        mermaid: fm.mermaid,
        codeCopy: true,
        imageLightbox: true,
    });

    const seo = buildSeo({
        title: fm.title,
        description: fm.description ?? fm.summary,
        image: fm.ogImage ?? fm.cover,
        type: 'article',
        url,
        defaults: siteConfig.seo,
        siteUrl: siteConfig.url,
    });

    return {
        id: entry.id,
        slug,
        url,
        filePath: entry.filePath ?? entry.id,
        frontmatter: fm,
        body: entry.body ?? '',
        html: rendered.html,
        headings: rendered.headings,
        toc: buildToc(rendered.headings),
        readingTime: calcReadingTime(entry.body ?? ''),
        wordCount: countWords(entry.body ?? ''),
        excerpt:
            fm.summary && fm.summary.trim()
                ? fm.summary
                : truncate(entry.body ?? '', 200),
        seo,
        // 单篇文章视图：postSlugs 在 tags.service.ts / categories.service.ts 中聚合
        tags: (fm.tags ?? []).map((name) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            postSlugs: [],
        })),
        category: {
            name: fm.category ?? '未分类',
            slug: (fm.category ?? '未分类').toLowerCase().replace(/\s+/g, '-'),
            postSlugs: [],
        },
        media: rendered.media,
        // 由 Pagefind 构建后生成，不在 Post 阶段填充
        searchDocuments: [],
        createdAt: fm.date,
        updatedAt: fm.updated ?? fm.date,
    };
}

// ---------- 内部：缓存 ----------

let cache: Post[] | null = null;
const useCache = import.meta.env.PROD;

async function getAllPostsRaw(): Promise<Post[]> {
    if (useCache && cache) return cache;

    const entries = await getCollection('posts');
    const posts = await Promise.all(entries.map(entryToPost));

    // slug 全局唯一检测
    const seen = new Map<string, string>();
    for (const post of posts) {
        const existing = seen.get(post.slug);
        if (existing && existing !== post.id) {
            throw new Error(
                `[content] slug 冲突: "${post.slug}" 被 ${existing} 和 ${post.id} 同时使用`
            );
        }
        seen.set(post.slug, post.id);
    }

    if (useCache) cache = posts;
    return posts;
}

// ---------- 对外：基础查询 ----------

export async function getAllPosts(options?: {
    includeDrafts?: boolean;
    sort?: 'date-desc' | 'date-asc';
    limit?: number;
}): Promise<Post[]> {
    const posts = await getAllPostsRaw();

    const filtered = options?.includeDrafts
        ? posts
        : posts.filter((p) => p.frontmatter.draft !== true);

    const sorted = [...filtered].sort((a, b) => {
        const diff =
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime();
        return options?.sort === 'date-asc' ? -diff : diff;
    });

    if (typeof options?.limit === 'number') {
        return sorted.slice(0, options.limit);
    }
    return sorted;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const posts = await getAllPosts();
    return posts.find((p) => p.slug === slug) ?? null;
}

// ---------- 对外：按标签 / 分类 / 相关文章 ----------

export async function getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await getAllPosts();
    const normalized = tag.toLowerCase();
    return posts.filter((p) =>
        (p.frontmatter.tags ?? []).some((t) => t.toLowerCase() === normalized)
    );
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await getAllPosts();
    const normalized = category.toLowerCase();
    return posts.filter(
        (p) =>
            (p.frontmatter.category ?? '未分类').toLowerCase() === normalized
    );
}

export async function getRelatedPosts(
    slug: string,
    limit = 3
): Promise<Post[]> {
    const posts = await getAllPosts();
    const current = posts.find((p) => p.slug === slug);
    if (!current) return [];

    const currentTags = new Set(current.frontmatter.tags ?? []);
    const currentCategory = current.frontmatter.category ?? '未分类';

    return posts
        .filter((p) => p.slug !== slug)
        .map((p) => {
            const sharedTags = (p.frontmatter.tags ?? []).filter((t) =>
                currentTags.has(t)
            ).length;
            const sameCategory =
                (p.frontmatter.category ?? '未分类') === currentCategory ? 1 : 0;
            return { post: p, score: sharedTags * 2 + sameCategory };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.post);
}