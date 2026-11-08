import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { SOUND_FILES, type SoundId } from '../model/sound-manifest';

/** Loads one sound ahead of time and returns a function that plays it from the start. */
export function useSound(id: SoundId): () => void {
  const player = useAudioPlayer(SOUND_FILES[id]);

  return useCallback(() => {
    // Rewinding takes a moment. Play only once it's done; otherwise, after a sound
    // has finished, `play()` arrives while the player is still at the end and stays silent.
    void player.seekTo(0).then(() => {
      player.play();
    });
  }, [player]);
}
