import type { MarkdownStyle, MarkdownStyleDefinition } from '@/domain/types';
import { markdownStyles } from '@/config/markdown-styles';

export function resolveMarkdownStyle(
    style?: MarkdownStyle
): MarkdownStyleDefinition {
    const found = markdownStyles.find((s) => s.id === style);
    return found ?? markdownStyles[0];
}