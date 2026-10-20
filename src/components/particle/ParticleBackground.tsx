// src/components/particle/ParticleBackground.tsx
import { useEffect, useMemo, useState } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { particleConfig } from '@/config/particle.config';
import { shouldEnableParticle } from '@/services/particle';

// 1. 在模块作用域定义初始化函数
const initParticles = async (engine: Engine): Promise<void> => {
    await loadSlim(engine);
};

export default function ParticleBackground() {
    const [enabled, setEnabled] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // 2. 判断是否启用粒子（开关、移动端、reduced-motion）
    useEffect(() => {
        // 只要本地存储变了，就重新判断
        const check = () => {
            const enabled = shouldEnableParticle(particleConfig);
            setEnabled(enabled);
        };
        check();

        window.addEventListener('techblog:particle-change', check);
        window.addEventListener('resize', check);
        return () => {
            window.removeEventListener('techblog:particle-change', check);
            window.removeEventListener('resize', check);
        };
    }, []);

    // 3. 监听主题变化
    useEffect(() => {
        const getTheme = () => (document.documentElement.dataset.theme as 'light' | 'dark') || 'light';
        setTheme(getTheme());
        const handle = () => setTheme(getTheme());
        window.addEventListener('techblog:theme-change', handle);
        return () => window.removeEventListener('techblog:theme-change', handle);
    }, []);

    // 4. 根据主题生成配置（注意 paint 字段）
    const options: ISourceOptions = useMemo(() => {
        const color = theme === 'dark' ? particleConfig.colorDark : particleConfig.colorLight;

        return {
            fullScreen: { enable: false },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: particleConfig.interactive, mode: 'grab' },
                    onClick: { enable: particleConfig.interactive, mode: 'push' },
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 0.5 } },
                    push: { quantity: 4 },
                },
            },
            particles: {
                // paint: {
                //     fill: { color: color }, // v4 中 particles.color 已迁移至此
                // },
                color: { value: color },
                links: {
                    color: color,
                    distance: particleConfig.linkDistance,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: { default: 'bounce' },
                    random: false,
                    speed: particleConfig.speed,
                    straight: false,
                },
                number: {
                    density: { enable: true, width: 1920, height: 1080 },
                    value: particleConfig.density,
                },
                opacity: { value: 0.5 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
        };
    }, [theme]);

    if (!enabled) return null;

    // 5. 用 ParticlesProvider 包裹，内部根据 enabled 判断是否渲染
    return (
        <ParticlesProvider init={initParticles}>
            {enabled && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Particles id="tsparticles" options={options} />
                </div>
            )}
        </ParticlesProvider>
    );
}