import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { TOPICS, useWordSound, WordPicture, WORDS, type WordId } from '@/features/content';
import { colors, radius, space, textStyles } from '@/ui';

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
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.grid}>
      {topic.words['6-10'].map((wordId) => (
        <WordCard key={wordId} wordId={wordId} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTop },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: space[4],
    padding: space[5],
  },
  card: {
    alignItems: 'center',
    gap: space[1],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.large,
    backgroundColor: colors.paper,
  },
  kurdish: { ...textStyles.kurdishWord, writingDirection: 'rtl' },
  soundsLike: textStyles.latinSmall,
});
