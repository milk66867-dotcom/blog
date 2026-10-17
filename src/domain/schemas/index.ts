import type { Result } from '@/domain/types';
import type { PostFrontmatter, PageFrontmatter, SiteConfig } from '@/domain/types';
import {
    PostFrontmatterSchema,
    PageFrontmatterSchema,
} from './post.schema';
import { SiteConfigSchema } from './site.schema';

export { PostFrontmatterSchema, PageFrontmatterSchema, SiteConfigSchema };

export function validatePostFrontmatter(input: unknown): Result<PostFrontmatter> {
    const parsed = PostFrontmatterSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                code: 'CONTENT_SCHEMA_INVALID',
                message: 'Post frontmatter 校验失败',
                detail: parsed.error.flatten(),
            },
        };
    }
    return { ok: true, value: parsed.data };
}

export function validatePageFrontmatter(input: unknown): Result<PageFrontmatter> {
    const parsed = PageFrontmatterSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                code: 'CONTENT_SCHEMA_INVALID',
                message: 'Page frontmatter 校验失败',
                detail: parsed.error.flatten(),
            },
        };
    }
    return { ok: true, value: parsed.data };
}

export function validateSiteConfig(input: unknown): Result<SiteConfig> {
    const parsed = SiteConfigSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                code: 'CONTENT_SCHEMA_INVALID',
                message: 'SiteConfig 校验失败',
                detail: parsed.error.flatten(),
            },
        };
    }
    return { ok: true, value: parsed.data };
}