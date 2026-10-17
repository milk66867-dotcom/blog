import type { IntegrationConfig } from '@/domain/types';

export const integrations: IntegrationConfig = {
    search: { provider: 'pagefind', enabled: true },
    comments: { provider: 'giscus', enabled: true },
    analytics: { provider: 'cloudflare', enabled: true },
    cms: { provider: 'decap', enabled: false },
};