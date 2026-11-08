import { setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';

/**
 * How Kaw's sounds behave on the phone:
 * - they play even when the iPhone's silent switch is on (kids' phones often are);
 * - other apps' music gets quieter while a word plays, then comes back.
 */
export const APP_AUDIO_MODE = {
  playsInSilentMode: true,
  interruptionMode: 'duckOthers',
} as const;

/** Applies the app's sound settings once. */
export function useAppAudioMode(): void {
  useEffect(() => {
    void setAudioModeAsync(APP_AUDIO_MODE);
  }, []);
}
