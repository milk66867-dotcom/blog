export interface AnalyticsConfig {
    enabled: boolean;
    provider: 'cloudflare';
    token: string;
}

export interface AnalyticsEvent {
    id: string;
    type: 'pageview' | 'click' | 'search' | 'comment';
    path: string;
    referrer?: string;
    timestamp: string;
    meta?: Record<string, string | number | boolean>;
}