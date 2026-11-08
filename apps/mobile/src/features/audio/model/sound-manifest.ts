/**
 * The one list of every sound in the app (D6): sound ID → file.
 * Files live in assets/audio/<group>/<name>.m4a, cleaned (trimmed, even volume, mono).
 */
export const SOUND_FILES = {
  'word.hello': require('@/assets/audio/word/hello.m4a'),
} satisfies Record<string, number>;

export type SoundId = keyof typeof SOUND_FILES;
