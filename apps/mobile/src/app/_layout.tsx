import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppAudioMode } from '@/platform/audio/use-app-audio-mode';
import { LanguageProvider } from '@/platform/language';

export default function RootLayout() {
  useAppAudioMode();

  return (
    <GestureHandlerRootView style={styles.root}>
      <LanguageProvider>
        <Stack />
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
