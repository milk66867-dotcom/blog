import type { DataModelVersion } from './common';
import type { MarkdownStyle, Theme } from './style';
import type { ParticleConfig } from './particle';
import type { SEODefaults } from './seo';
import type { CommentConfig } from './comment';
import type { AnalyticsConfig } from './analytics';

export interface Author {
    name: string;
    avatar?: string;
    bio?: string;
    email?: string;
    url?: string;
}

export interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
    external?: boolean;
    order: number;
    visible: boolean;
}

export interface SocialLink {
    platform: string;
    label: string;
    url: string;
    icon?: string;
}

export interface PaginationConfig {
    pageSize: number;
}

export interface IntegrationConfig {
    search: {
        provider: 'pagefind';
        enabled: boolean;
    };
    comments: {
        provider: 'giscus';
        enabled: boolean;
    };
    analytics: {
        provider: 'cloudflare';
        enabled: boolean;
    };
    cms: {
        provider: 'decap';
        enabled: boolean;
    };
}

export interface SiteConfig {
    version: DataModelVersion;
    title: string;
    description: string;
    url: string;
    base: string;
    language: string;
    author: Author;
    navigation: NavigationItem[];
    socialLinks: SocialLink[];
    defaultTheme: Theme;
    defaultMarkdownStyle: MarkdownStyle;
    particle: ParticleConfig;
    seo: SEODefaults;
    comments: CommentConfig;
    analytics: AnalyticsConfig;
    pagination: PaginationConfig;
    integrations: IntegrationConfig;
    license?: string;
}