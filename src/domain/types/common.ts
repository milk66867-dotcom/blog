export type BlogErrorCode =
    | 'POST_NOT_FOUND'
    | 'CONTENT_SCHEMA_INVALID'
    | 'BUILD_FAILED'
    | 'SEARCH_INDEX_MISSING'
    | 'GISCUS_LOAD_FAILED'
    | 'PARTICLES_UNSUPPORTED'
    | 'EXTERNAL_API_RATE_LIMIT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN';

export type BlogError = {
    code: BlogErrorCode;
    message: string;
    detail?: unknown;
    traceId?: string;
};

export type Result<T> =
    | { ok: true; value: T }
    | { ok: false; error: BlogError };

export interface DataModelVersion {
    schemaVersion: string;
    contentVersion: string;
    updatedAt: string;
}

export interface BuildInfo {
    version: string;
    commit: string;
    buildTime: string;
    nodeVersion: string;
    astroVersion: string;
}