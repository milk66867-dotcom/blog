// src/services/comments/comment.adapter.ts
import type { CommentConfig, Theme } from '@/domain/types';

export interface CommentAdapter {
    mount(container: HTMLElement, config: CommentConfig, theme: Theme): void;
    updateTheme(theme: Theme): void;
}