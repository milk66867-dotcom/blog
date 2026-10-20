// src/services/search/search.adapter.ts
export interface SearchResult {
    url: string;
    title: string;
    excerpt: string;
    anchors: { id: string; text: string }[];
}

export interface SearchAdapter {
    init(): Promise<void>;
    search(query: string, options?: { limit?: number }): Promise<SearchResult[]>;
}