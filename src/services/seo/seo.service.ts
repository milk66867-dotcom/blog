import type { SEO, SEODefaults } from '@/domain/types';
import { joinUrl } from '@/domain/utils';

export function buildSeo(input: {
    title: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    url: string;
    noindex?: boolean;
    defaults: SEODefaults;
    siteUrl: string;
}): SEO {
    const fullUrl = joinUrl(input.siteUrl, input.url);
    return {
        title: input.defaults.titleTemplate.replace('%s', input.title),
        description: input.description ?? input.defaults.defaultDescription,
        keywords: input.defaults.keywords,
        canonical: fullUrl,
        ogImage: input.image ?? input.defaults.defaultOgImage,
        ogType: input.type ?? 'website',
        noindex: input.noindex ?? false,
    };
}