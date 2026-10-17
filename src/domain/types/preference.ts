import type { MarkdownStyle, Theme } from './style';
import type { PostFrontmatter } from './post';

export interface UserPreference {
    theme: Theme;
    markdownStyle: MarkdownStyle;
    particleEnabled: boolean;
    fontSize: 'sm' | 'md' | 'lg';
    searchHistory: string[];
    updatedAt: string;
}

export interface Draft {
    id: string;
    title: string;
    content: string;
    frontmatter: Partial<PostFrontmatter>;
    createdAt: string;
    updatedAt: string;
}