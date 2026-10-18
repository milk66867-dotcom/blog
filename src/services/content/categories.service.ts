// tags.service.ts
import type { Tag } from '@/domain/types'; // 替换为你项目里实际定义 Tag 的路径
import { getAllPosts } from '@/services/content/posts.service';
export async function getAllTags(): Promise<Tag[]> {
    const posts = await getAllPosts();
    const map = new Map<string, Tag>();

    for (const post of posts) {
        for (const tag of post.tags) {
            const existing = map.get(tag.slug);
            if (existing) {
                existing.postSlugs.push(post.slug);
            } else {
                map.set(tag.slug, { ...tag, postSlugs: [post.slug] });
            }
        }
    }

    return Array.from(map.values());
}