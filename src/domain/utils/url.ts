export function joinUrl(base: string, path: string): string {
    const b = base.replace(/\/+$/, '');
    const p = path.replace(/^\/+/, '');
    return `${b}/${p}`;
}

export function absoluteUrl(site: string, path: string): string {
    return joinUrl(site, path);
}