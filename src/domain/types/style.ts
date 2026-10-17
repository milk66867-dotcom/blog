export type MarkdownStyle =
    | 'github'
    | 'juejin'
    | 'vue'
    | 'tech-dark'
    | 'magazine'
    | 'minimal';

export interface MarkdownStyleDefinition {
    id: MarkdownStyle;
    name: string;
    description: string;
    className: string;
    cssVariables: Record<string, string>;
    codeTheme: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeDefinition {
    id: Theme;
    name: string;
    className: string;
}