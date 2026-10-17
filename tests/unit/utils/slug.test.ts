import { describe, it, expect } from 'vitest';
import { slugify, slugFromFilename } from '@/domain/utils';

describe('slugify', () => {
    it('小写并替换空格', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });
    it('去除特殊字符', () => {
        expect(slugify('Hello@World!')).toBe('helloworld');
    });
    it('合并连续横线', () => {
        expect(slugify('a---b')).toBe('a-b');
    });
    it('去除首尾横线', () => {
        expect(slugify('-abc-')).toBe('abc');
    });
});

describe('slugFromFilename', () => {
    it('去掉日期前缀', () => {
        expect(slugFromFilename('2026-10-15-Hello-World.md')).toBe('hello-world');
    });
});