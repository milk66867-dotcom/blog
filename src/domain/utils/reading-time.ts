import { countWords } from './text';

export function calcReadingTime(text: string, wpm: number = 300): number {
    const words = countWords(text);
    return Math.max(1, Math.ceil(words / wpm));
}