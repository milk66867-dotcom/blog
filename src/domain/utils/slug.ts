export function slugify(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function slugFromFilename(filename: string): string {
    // YYYY-MM-DD-slug.md → slug
    const base = filename.replace(/\.mdx?$/, '');
    const withoutDate = base.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return slugify(withoutDate);
}