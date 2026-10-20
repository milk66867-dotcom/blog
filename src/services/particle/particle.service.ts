// src/services/particle/particle.service.ts
import type { ParticleConfig } from '@/domain/types';

export const PARTICLE_KEY = 'techblog:particle-enabled';

export function getParticleEnabledLocal(): boolean {
    if (typeof localStorage === 'undefined') return true;
    const val = localStorage.getItem(PARTICLE_KEY);
    return val === null ? true : val === 'true';
}

export function setParticleEnabledLocal(enabled: boolean): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PARTICLE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('techblog:particle-change', { detail: enabled }));
}

/**
 * 判断是否允许渲染粒子
 */
export function shouldEnableParticle(config: ParticleConfig): boolean {
    if (!config.enabled) return false;
    if (typeof window === 'undefined') return false;

    // 1. 检查本地存储的手动开关
    if (!getParticleEnabledLocal()) return false;

    // 2. 检查是否移动端，且配置不允许移动端开启
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !config.mobileEnabled) return false;

    // 3. 检查系统是否开启了“减少动画”（无障碍）
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && config.respectReducedMotion) return false;

    return true;
}