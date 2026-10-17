import type { MarkdownStyleDefinition } from '@/domain/types';

export const markdownStyles: MarkdownStyleDefinition[] = [
    {
        id: 'github',
        name: 'GitHub',
        description: '简洁、通用',
        className: 'md-style-github',
        cssVariables: {},
        codeTheme: 'github-light',
    },
    {
        id: 'juejin',
        name: '掘金',
        description: '中文技术社区风格',
        className: 'md-style-juejin',
        cssVariables: {},
        codeTheme: 'github-light',
    },
    {
        id: 'vue',
        name: 'Vue 文档',
        description: '文档风',
        className: 'md-style-vue',
        cssVariables: {},
        codeTheme: 'github-light',
    },
    {
        id: 'tech-dark',
        name: '科技暗黑',
        description: '霓虹、深色',
        className: 'md-style-tech-dark',
        cssVariables: {},
        codeTheme: 'github-dark',
    },
    {
        id: 'magazine',
        name: '杂志',
        description: '大标题、留白',
        className: 'md-style-magazine',
        cssVariables: {},
        codeTheme: 'github-light',
    },
    {
        id: 'minimal',
        name: '极简阅读',
        description: '专注阅读',
        className: 'md-style-minimal',
        cssVariables: {},
        codeTheme: 'github-light',
    },
];