import { describe, it, expect } from 'vitest';
import { validatePostFrontmatter } from '@/domain/schemas';

describe('validatePostFrontmatter', () => {
    it('合法 frontmatter 返回 ok', () => {
        const result = validatePostFrontmatter({
            title: 'Hello',
            date: '2026-10-15T10:00:00+08:00',
        });
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.title).toBe('Hello');
            expect(result.value.draft).toBe(false);
        }
    });

    it('缺 title 返回错误', () => {
        const result = validatePostFrontmatter({
            date: '2026-10-15T10:00:00+08:00',
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe('CONTENT_SCHEMA_INVALID');
        }
    });

    it('非法 style 返回错误', () => {
        const result = validatePostFrontmatter({
            title: 'Hello',
            date: '2026-10-15T10:00:00+08:00',
            style: 'invalid-style',
        });
        expect(result.ok).toBe(false);
    });
});