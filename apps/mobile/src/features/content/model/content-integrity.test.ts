import { describe, expect, it } from 'vitest';

import { TOPICS } from '../topics';
import { WORD_BANKS, WORDS } from '../words';
import type { AgeGroup } from './word';

// Kurdish (Sorani) letters live in the Arabic block; also allow spaces, "؟" and the
// zero-width non-joiner Sorani sometimes uses. Catches Latin text pasted by mistake.
const KURDISH_SCRIPT = /^[\u0600-\u06FF\u200C ]+$/;

const allWords = Object.entries(WORDS);
const allTopicLists = Object.entries(TOPICS).flatMap(([topicId, topic]) =>
  Object.entries(topic.words).map(([age, wordIds]) => ({
    name: `${topicId} (${age as AgeGroup})`,
    wordIds: wordIds as readonly string[],
  })),
);

describe('content integrity', () => {
  it('defines every word ID only once across all word banks', () => {
    const definedIds = WORD_BANKS.flatMap((bank) => Object.keys(bank));
    const twice = definedIds.filter((id, index) => definedIds.indexOf(id) !== index);

    expect(twice).toEqual([]);
    expect(Object.keys(WORDS)).toHaveLength(definedIds.length);
  });

  it.each(allWords)('word "%s" has Kurdish text, a sound guide and every meaning', (_id, word) => {
    expect(word.kurdish.trim()).not.toBe('');
    expect(word.kurdish).toMatch(KURDISH_SCRIPT);
    expect(word.soundsLike.trim()).not.toBe('');
    for (const meaning of Object.values(word.meaning)) {
      expect(meaning.trim()).not.toBe('');
    }
  });

  it.each(allTopicLists)('$name lists real words, each only once', ({ wordIds }) => {
    expect(wordIds.length).toBeGreaterThan(0);
    expect(new Set(wordIds).size).toBe(wordIds.length);
    for (const id of wordIds) {
      expect(WORDS).toHaveProperty([id]);
    }
  });
});
