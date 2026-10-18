// src/services/content/tags.service.ts
import type { Tag } from '@/domain/types';
import { getAllPosts } from './posts.service';

export async function getAllTags(): Promise<Tag[]> {
    const posts = await getAllPosts();
    const map = new Map<string, Tag>();

    for (const post of posts) {
        const seen = new Set<string>();

        for (const tag of post.tags) {
            if (seen.has(tag.slug)) continue;
            seen.add(tag.slug);

            const existing = map.get(tag.slug);
            if (existing) {
                // 保留首次出现的 name；大小写不同的标签合并到同一 slug
                existing.postSlugs.push(post.slug);
            } else {
                map.set(tag.slug, { ...tag, postSlugs: [post.slug] });
            }
        }
    }

    return Array.from(map.values()).sort(
        (a, b) => b.postSlugs.length - a.postSlugs.length
    );
}