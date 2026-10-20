// src/components/markdown/ImageLightbox.tsx
import { useEffect } from 'react';

export default function ImageLightbox() {
    useEffect(() => {
        const containers = document.querySelectorAll<HTMLElement>('[data-image-lightbox="true"]');
        const cleanups: Array<() => void> = [];

        const overlay = document.createElement('div');
        overlay.className =
            'fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', '图片预览');

        const img = document.createElement('img');
        img.className = 'max-h-full max-w-full rounded shadow-2xl';
        overlay.appendChild(img);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '×';
        closeBtn.setAttribute('aria-label', '关闭');
        closeBtn.className =
            'absolute right-4 top-4 text-3xl leading-none text-white/80 hover:text-white';
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);

        const open = (src: string, alt: string) => {
            img.src = src;
            img.alt = alt;
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
            document.body.style.overflow = '';
        };

        const onOverlayClick = (e: MouseEvent) => {
            if (e.target === overlay) close();
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        overlay.addEventListener('click', onOverlayClick);
        closeBtn.addEventListener('click', close);
        document.addEventListener('keydown', onKeyDown);

        containers.forEach((container) => {
            const images = container.querySelectorAll<HTMLImageElement>('img[data-lightbox]');
            images.forEach((image) => {
                if (image.dataset.lightboxAttached === 'true') return;
                image.dataset.lightboxAttached = 'true';
                image.style.cursor = 'zoom-in';

                const onClick = () => open(image.src, image.alt);
                image.addEventListener('click', onClick);
                cleanups.push(() => {
                    image.removeEventListener('click', onClick);
                    delete image.dataset.lightboxAttached;
                });
            });
        });

        return () => {
            cleanups.forEach((fn) => fn());
            overlay.removeEventListener('click', onOverlayClick);
            closeBtn.removeEventListener('click', close);
            document.removeEventListener('keydown', onKeyDown);
            overlay.remove();
            document.body.style.overflow = '';
        };
    }, []);

    return null;
}