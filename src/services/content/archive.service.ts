import { getAllPosts } from '@/services/content/posts.service';
import type { ArchiveGroup, PostSummary } from '@/domain/types';

export async function getArchive(): Promise<ArchiveGroup[]> {
    const posts = await getAllPosts();
    const map = new Map<number, Map<number, PostSummary[]>>();

    for (const post of posts) {
        const date = new Date(post.frontmatter.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        if (!map.has(year)) map.set(year, new Map());
        if (!map.get(year)!.has(month)) map.get(year)!.set(month, []);

        map.get(year)!.get(month)!.push({
            slug: post.slug,
            title: post.frontmatter.title,
            date: post.frontmatter.date,
            url: post.url,
            tags: post.frontmatter.tags ?? [],
            category: post.frontmatter.category,
        });
    }

    return Array.from(map.entries())
        .sort(([a], [b]) => b - a)
        .map(([year, months]) => ({
            year,
            count: Array.from(months.values()).reduce((sum, list) => sum + list.length, 0),
            months: Array.from(months.entries())
                .sort(([a], [b]) => b - a)
                .map(([month, list]) => ({ month, count: list.length, posts: list })),
        }));
}