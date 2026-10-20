// src/services/content/categories.service.ts
import type { Category } from '@/domain/types';
import { getAllPosts } from './posts.service';

export async function getAllCategories(): Promise<Category[]> {
    const posts = await getAllPosts();
    const map = new Map<string, Category>();

    for (const post of posts) {
        const category = post.category;
        const existing = map.get(category.slug);

        if (existing) {
            existing.postSlugs.push(post.slug);
        } else {
            map.set(category.slug, { ...category, postSlugs: [post.slug] });
        }
    }

    return Array.from(map.values()).sort(
        (a, b) => b.postSlugs.length - a.postSlugs.length
    );
}