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
    // 确保图片是绝对路径
    const rawImage = input.image ?? input.defaults.defaultOgImage;
    const absoluteImage = rawImage.startsWith('http')
        ? rawImage
        : joinUrl(input.siteUrl, rawImage);
    const isHomePage = input.url === '/' || input.url === '';
    const finalTitle = isHomePage
        ? input.title
        : input.defaults.titleTemplate.replace('%s', input.title);
    return {
        title: finalTitle,
        description: input.description ?? input.defaults.defaultDescription,
        keywords: input.defaults.keywords,
        canonical: fullUrl,
        ogImage: absoluteImage,
        ogType: input.type ?? 'website',
        noindex: input.noindex ?? false,
    };
}