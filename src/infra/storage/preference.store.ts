// src/infra/storage/preference.store.ts
export function getSetting<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') return fallback;
    try {
        const val = localStorage.getItem(key);
        return val ? (JSON.parse(val) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function setSetting<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeSetting(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
}