import type { Word } from '../model/word';

export const HELLO_AND_ME_WORDS = {
  hello: {
    kurdish: 'سڵاو',
    soundsLike: 'slaw',
    meaning: { en: 'hello', nl: 'hallo' },
  },
  sorry: {
    kurdish: 'ببورە',
    soundsLike: 'bibûre',
    meaning: { en: 'sorry', nl: 'sorry' },
  },
  'thank-you': {
    kurdish: 'سوپاس',
    soundsLike: 'supas',
    meaning: { en: 'thank you', nl: 'dank je' },
  },
  yes: {
    kurdish: 'بەڵێ',
    soundsLike: 'belê',
    meaning: { en: 'yes', nl: 'ja' },
  },
  no: {
    kurdish: 'نەخێر',
    soundsLike: 'nexêr',
    meaning: { en: 'no', nl: 'nee' },
  },
  'how-are-you': {
    kurdish: 'چۆنی؟',
    soundsLike: 'çonî',
    meaning: { en: 'how are you?', nl: 'hoe gaat het?' },
  },
  'im-fine': {
    kurdish: 'باشم',
    soundsLike: 'başim',
    meaning: { en: "I'm fine", nl: 'het gaat goed' },
  },
  'whats-your-name': {
    kurdish: 'ناوت چییە؟',
    soundsLike: 'nawit çîye',
    meaning: { en: "what's your name?", nl: 'hoe heet je?' },
  },
  'my-name-is': {
    kurdish: 'ناوم',
    soundsLike: 'nawim',
    meaning: { en: 'my name is …', nl: 'ik heet …' },
  },
  goodbye: {
    kurdish: 'خواحافیز',
    soundsLike: 'xwahafîz',
    meaning: { en: 'goodbye', nl: 'dag' },
  },
} as const satisfies Record<string, Word>;
