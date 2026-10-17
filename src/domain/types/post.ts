import type { MarkdownStyle } from './style';
import type { SEO } from './seo';

export interface PostFrontmatter {
    title: string;
    date: string;
    updated?: string;
    tags?: string[];
    category?: string;
    cover?: string;
    summary?: string;
    draft?: boolean;
    style?: MarkdownStyle;
    pinned?: boolean;
    toc?: boolean;
    comments?: boolean;
    math?: boolean;
    mermaid?: boolean;
    author?: string;
    license?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    slug?: string;
}

export interface Heading {
    depth: number;
    slug: string;
    text: string;
}

export interface TOCItem {
    id: string;
    text: string;
    depth: number;
    children?: TOCItem[];
}

export interface Tag {
    name: string;
    slug: string;
    postSlugs: string[];
}

export interface Category {
    name: string;
    slug: string;
    postSlugs: string[];
}

export interface MediaAsset {
    id: string;
    type: 'image' | 'video' | 'audio' | 'file';
    path: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    size?: number;
    mime: string;
    hash?: string;
}

export interface CommentThread {
    id: string;
    postSlug: string;
    provider: 'giscus';
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title';
    discussionId?: string;
    enabled: boolean;
}

export interface SearchAnchor {
    id: string;
    text: string;
}

export interface SearchDocument {
    id: string;
    url: string;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    category?: string;
    date: string;
    wordCount: number;
    anchors: SearchAnchor[];
}

export interface Post {
    id: string;
    slug: string;
    url: string;
    filePath: string;
    frontmatter: PostFrontmatter;
    body: string;
    html: string;
    headings: Heading[];
    toc: TOCItem[];
    readingTime: number;
    wordCount: number;
    excerpt: string;
    seo: SEO;
    tags: Tag[];
    category: Category;
    media: MediaAsset[];
    commentThread?: CommentThread;
    searchDocuments: SearchDocument[];
    createdAt: string;
    updatedAt: string;
}

export interface PostSummary {
    slug: string;
    title: string;
    date: string;
    url: string;
    tags: string[];
    category?: string;
}

export interface ArchiveMonth {
    month: number;
    count: number;
    posts: PostSummary[];
}

export interface ArchiveGroup {
    year: number;
    count: number;
    months: ArchiveMonth[];
}

export interface PageFrontmatter {
    title: string;
    description?: string;
    updated?: string;
    draft?: boolean;
    toc?: boolean;
    comments?: boolean;
}

export interface Page {
    slug: string;
    title: string;
    url: string;
    frontmatter: PageFrontmatter;
    body: string;
    html: string;
    seo: SEO;
}