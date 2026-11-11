import { bundledAsset, type BundledAsset } from '@/platform/assets/bundled-asset';

import type { WordId } from '../words';

/**
 * Every word's picture: word ID → 3D picture in assets/pictures/word/ (1024 px WebP, transparent).
 * Typecheck fails if a word has no picture, or if a picture points to a word that doesn't exist.
 */
export const WORD_PICTURES = {
  hello: bundledAsset(require('@/assets/pictures/word/hello.webp')),
  sorry: bundledAsset(require('@/assets/pictures/word/sorry.webp')),
  'thank-you': bundledAsset(require('@/assets/pictures/word/thank-you.webp')),
  yes: bundledAsset(require('@/assets/pictures/word/yes.webp')),
  no: bundledAsset(require('@/assets/pictures/word/no.webp')),
  'how-are-you': bundledAsset(require('@/assets/pictures/word/how-are-you.webp')),
  'im-fine': bundledAsset(require('@/assets/pictures/word/im-fine.webp')),
  'whats-your-name': bundledAsset(require('@/assets/pictures/word/whats-your-name.webp')),
  'my-name-is': bundledAsset(require('@/assets/pictures/word/my-name-is.webp')),
  goodbye: bundledAsset(require('@/assets/pictures/word/goodbye.webp')),
} satisfies Record<WordId, BundledAsset>;
