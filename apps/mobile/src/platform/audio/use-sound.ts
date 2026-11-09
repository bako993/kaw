import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

/** A sound file shipped inside the app, e.g. `require('@/assets/audio/word/hello.m4a')`. */
export type SoundFile = number;

/** Loads one sound ahead of time and returns a function that plays it from the start. */
export function useSound(file: SoundFile): () => void {
  const player = useAudioPlayer(file);

  return useCallback(() => {
    // Rewinding takes a moment. Play only once it's done; otherwise, after a sound
    // has finished, `play()` arrives while the player is still at the end and stays silent.
    void player.seekTo(0).then(() => {
      player.play();
    });
  }, [player]);
}
