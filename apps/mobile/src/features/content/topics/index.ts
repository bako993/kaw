import type { Topic } from '../model/topic';
import type { WordId } from '../words';

export const TOPICS = {
  'hello-and-me': {
    words: {
      '6-10': [
        'hello',
        'welcome',
        'thank-you',
        'yes',
        'no',
        'how-are-you',
        'im-fine',
        'whats-your-name',
        'my-name-is',
        'goodbye',
      ],
      '3-5': ['hello', 'thank-you', 'yes', 'no', 'im-fine', 'goodbye'],
    },
  },
} as const satisfies Record<string, Topic<WordId>>;

export type TopicId = keyof typeof TOPICS;
