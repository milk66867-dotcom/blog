
import { getAllPosts } from '@/services/content/posts.service';
import type { Post } from '@/domain/types'; // 替换为你项目里实际定义 Tag 的路径

export async function getAdjacentPosts(
    slug: string
): Promise<{ prev: Post | null; next: Post | null }> {
    const posts = await getAllPosts({ sort: 'date-desc' });
    const index = posts.findIndex((p) => p.slug === slug);

    if (index === -1) return { prev: null, next: null };

    return {
        prev: index > 0 ? posts[index - 1] : null,
        next: index < posts.length - 1 ? posts[index + 1] : null,
    };
}