import type { Post, SiteConfig } from '@/domain/types';
import rss from '@astrojs/rss';
export async function buildRss(
    posts: Post[],
    site: SiteConfig
): Promise<string> {
    const feed = await rss({
        title: site.title,
        description: site.description,
        site: site.url,
        items: posts.map((post) => ({
            title: post.frontmatter.title,
            description: post.excerpt,
            pubDate: new Date(post.frontmatter.date),
            link: post.url,
            guid: post.url,
        })),
        customData: `<language>${site.language}</language>`,
    });

    return await feed.text();
}