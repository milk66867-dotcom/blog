import type { Post, SiteConfig } from '@/domain/types';
import { joinUrl } from '@/domain/utils';

export function buildArticleJsonLd(
    post: Post,
    site: SiteConfig
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.frontmatter.title,
        description: post.excerpt,
        datePublished: post.frontmatter.date,
        dateModified: post.frontmatter.updated ?? post.frontmatter.date,
        author: {
            '@type': 'Person',
            name: post.frontmatter.author ?? site.author.name,
        },
        url: joinUrl(site.url, post.url),
        image: post.seo.ogImage,
    };
}