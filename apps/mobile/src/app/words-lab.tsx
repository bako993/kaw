import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { TOPICS, useWordSound, WordPicture, WORDS, type WordId } from '@/features/content';
import { useAppAudioMode } from '@/platform/audio/use-app-audio-mode';

const topic = TOPICS['hello-and-me'];

function WordCard({ wordId }: { readonly wordId: WordId }) {
  const sayWord = useWordSound(wordId);
  const bounce = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.get() }] }));
  const word = WORDS[wordId];

  const onPressIn = () => {
    sayWord();
    bounce.set(
      withSequence(
        withTiming(0.94, { duration: 90 }),
        withSpring(1, { damping: 9, stiffness: 240 }),
      ),
    );
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      accessibilityRole="button"
      accessibilityLabel={word.meaning.en}
    >
      <Animated.View style={[styles.card, bounceStyle]}>
        <WordPicture wordId={wordId} size={140} />
        <Text style={styles.kurdish}>{word.kurdish}</Text>
        <Text style={styles.soundsLike}>{word.soundsLike}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function WordsLabScreen() {
  useAppAudioMode();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.grid}>
      {topic.words['6-10'].map((wordId) => (
        <WordCard key={wordId} wordId={wordId} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF6E6' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  card: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  kurdish: { fontSize: 24, fontWeight: '700', color: '#4A3F35', writingDirection: 'rtl' },
  soundsLike: { fontSize: 14, color: '#8A7A6A' },
});
