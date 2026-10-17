import type { SiteConfig } from '@/domain/types';
import { validateSiteConfig } from '@/domain/schemas';
import { navigation } from './nav';
import { socialLinks } from './social';
import { markdownStyles } from './markdown-styles';
import { particleConfig } from './particle.config';
import { integrations } from './integrations';

const rawConfig: SiteConfig = {
    version: {
        schemaVersion: '1.0.0',
        contentVersion: '1.0.0',
        updatedAt: '2026-10-15T10:00:00+08:00',
    },
    title: 'TechBlog',
    description: '一个科技感个人博客',
    url: 'https://techblog.pages.dev',
    base: '/',
    language: 'zh-CN',
    author: {
        name: 'Your Name',
        avatar: '/images/avatar/avatar.webp',
        bio: '前端开发者，热爱科技与写作。',
        email: 'me@example.com',
        url: '/about',
    },
    navigation,
    socialLinks,
    defaultTheme: 'system',
    defaultMarkdownStyle: 'github',
    particle: particleConfig,
    seo: {
        titleTemplate: '%s | TechBlog',
        defaultDescription: '科技感个人博客',
        defaultOgImage: '/images/og/og-default.webp',
        keywords: ['博客', '前端', '科技'],
    },
    comments: {
        enabled: true,
        provider: 'giscus',
        repo: 'yourname/techblog',
        repoId: 'R_xxx',
        category: 'Announcements',
        categoryId: 'DIC_xxx',
        mapping: 'pathname',
        reactionsEnabled: true,
        inputPosition: 'bottom',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN',
    },
    analytics: {
        enabled: false,
        provider: 'cloudflare',
        token: '',
    },
    pagination: {
        pageSize: 10,
    },
    integrations,
    license: 'CC BY-NC-SA 4.0',
};

const result = validateSiteConfig(rawConfig);
if (!result.ok) {
    console.error('[SiteConfig] 校验失败:', result.error.detail);
    throw new Error('SiteConfig 校验失败');
}

export const siteConfig: SiteConfig = result.value;
export { markdownStyles };