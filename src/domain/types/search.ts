export interface SearchResult {
    url: string;
    title: string;
    excerpt: string;
    anchors: { id: string; text: string }[];
}