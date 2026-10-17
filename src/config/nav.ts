import type { NavigationItem } from '@/domain/types';

export const navigation: NavigationItem[] = [
    { label: '首页', href: '/', order: 1, visible: true },
    { label: '文章', href: '/posts', order: 2, visible: true },
    { label: '标签', href: '/tags', order: 3, visible: true },
    { label: '分类', href: '/categories', order: 4, visible: true },
    { label: '归档', href: '/archive', order: 5, visible: true },
    { label: '关于', href: '/about', order: 6, visible: true },
];