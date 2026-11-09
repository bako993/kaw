import type { WordId } from '../words';

/**
 * Every word's picture: word ID → SVG file in assets/pictures/.
 * Typecheck fails if a word has no picture, or if a picture points to a word that doesn't exist.
 */
export const WORD_PICTURES = {
  hello: require('@/assets/pictures/hello-hello.svg'),
  welcome: require('@/assets/pictures/hello-welcome.svg'),
  'thank-you': require('@/assets/pictures/hello-thank-you.svg'),
  yes: require('@/assets/pictures/hello-yes.svg'),
  no: require('@/assets/pictures/hello-no.svg'),
  'how-are-you': require('@/assets/pictures/hello-how-are-you.svg'),
  'im-fine': require('@/assets/pictures/hello-im-fine.svg'),
  'whats-your-name': require('@/assets/pictures/hello-whats-your-name.svg'),
  'my-name-is': require('@/assets/pictures/hello-my-name-is.svg'),
  goodbye: require('@/assets/pictures/hello-goodbye.svg'),
} satisfies Record<WordId, number>;
