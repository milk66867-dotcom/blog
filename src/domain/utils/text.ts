export function truncate(text: string, max: number): string {
    const plain = text.replace(/\s+/g, ' ').trim();
    if (plain.length <= max) return plain;
    return plain.slice(0, max - 1).trimEnd() + '…';
}

export function countWords(text: string): number {
    const plain = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/[#>*_\-`~]/g, ' ')
        .trim();
    if (!plain) return 0;
    const cjk = (plain.match(/[\u4e00-\u9fa5]/g) || []).length;
    const words = plain
        .replace(/[\u4e00-\u9fa5]/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length;
    return cjk + words;
}