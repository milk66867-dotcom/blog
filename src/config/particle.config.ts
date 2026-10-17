import type { ParticleConfig } from '@/domain/types';

export const particleConfig: ParticleConfig = {
    enabled: true,
    density: 60,
    speed: 0.6,
    linkDistance: 120,
    interactive: true,
    mobileEnabled: false,
    respectReducedMotion: true,
    colorLight: '#0ea5e9',
    colorDark: '#22d3ee',
    fpsThreshold: 30,
};