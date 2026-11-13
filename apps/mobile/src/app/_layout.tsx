import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppAudioMode } from '@/platform/audio/use-app-audio-mode';
import { LanguageProvider } from '@/platform/language';

/**
 * Screen directions (M3e). The navigation turns the phone as part of each screen change,
 * so a screen never shows in the wrong direction first.
 * Kids' screens are sideways (either way round) by default; parent screens are upright.
 */
const KIDS_SCREEN = { orientation: 'landscape' } as const;
const PARENT_SCREEN = { orientation: 'portrait_up' } as const;

export default function RootLayout() {
  useAppAudioMode();

  return (
    <GestureHandlerRootView style={styles.root}>
      <LanguageProvider>
        <Stack screenOptions={KIDS_SCREEN}>
          <Stack.Screen name="index" options={PARENT_SCREEN} />
        </Stack>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
