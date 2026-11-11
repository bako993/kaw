import { bundledAsset, type BundledAsset } from '@/platform/assets/bundled-asset';

import type { WordId } from '../words';

/**
 * Every word's picture: word ID → SVG file in assets/pictures/.
 * Typecheck fails if a word has no picture, or if a picture points to a word that doesn't exist.
 */
export const WORD_PICTURES = {
  hello: bundledAsset(require('@/assets/pictures/hello-hello.svg')),
  welcome: bundledAsset(require('@/assets/pictures/hello-welcome.svg')),
  'thank-you': bundledAsset(require('@/assets/pictures/hello-thank-you.svg')),
  yes: bundledAsset(require('@/assets/pictures/hello-yes.svg')),
  no: bundledAsset(require('@/assets/pictures/hello-no.svg')),
  'how-are-you': bundledAsset(require('@/assets/pictures/hello-how-are-you.svg')),
  'im-fine': bundledAsset(require('@/assets/pictures/hello-im-fine.svg')),
  'whats-your-name': bundledAsset(require('@/assets/pictures/hello-whats-your-name.svg')),
  'my-name-is': bundledAsset(require('@/assets/pictures/hello-my-name-is.svg')),
  goodbye: bundledAsset(require('@/assets/pictures/hello-goodbye.svg')),
} satisfies Record<WordId, BundledAsset>;
