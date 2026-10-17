export interface CommentConfig {
    enabled: boolean;
    provider: 'giscus';
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title';
    reactionsEnabled: boolean;
    inputPosition: 'top' | 'bottom';
    theme: string;
    lang: string;
}