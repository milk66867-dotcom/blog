export interface SEO {
    title: string;
    description: string;
    keywords: string[];
    canonical?: string;
    ogImage?: string;
    ogType: 'website' | 'article';
    noindex: boolean;
    jsonLd?: Record<string, unknown>;
}

export interface SEODefaults {
    titleTemplate: string;
    defaultDescription: string;
    defaultOgImage: string;
    keywords: string[];
}