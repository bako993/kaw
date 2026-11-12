import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWordSound, WordPicture, WORDS, type WordId } from '@/features/content';
import { Kaw } from '@/features/kaw';
import {
  Chip,
  ChunkyButton,
  colors,
  FrostedTile,
  Icon,
  Meter,
  space,
  StudioBackground,
  textStyles,
  type TileState,
} from '@/ui';

// Temporary lab (M3c-4): the lesson engine (M4) replaces this hard-coded step.
const CHOICES: readonly WordId[] = ['hello', 'thank-you', 'goodbye'];
const TARGET: WordId = 'thank-you';
const KAW_SIZE = 230;
const TOP_BAR = 72;

function tileStateFor(wordId: WordId, solved: boolean, wrong: readonly WordId[]): TileState {
  if (solved) return wordId === TARGET ? 'right' : 'dim';
  return wrong.includes(wordId) ? 'wrong' : 'idle';
}

export default function LessonLabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const sayTarget = useWordSound(TARGET);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<readonly WordId[]>([]);

  useEffect(() => {
    sayTarget();
  }, [sayTarget]);

  const choose = (wordId: WordId) => {
    if (solved) return;
    if (wordId === TARGET) setSolved(true);
    else if (!wrong.includes(wordId)) setWrong([...wrong, wordId]);
  };

  const restart = () => {
    setSolved(false);
    setWrong([]);
    sayTarget();
  };

  const kawWidth = KAW_SIZE * 1.25;
  const roomForTiles = window.width - insets.left - insets.right - kawWidth - space[6] * 2;
  const tileWidth = Math.min(
    172,
    roomForTiles / CHOICES.length - space[5],
    ((window.height - TOP_BAR - space[5]) * 172) / 272,
  );

  return (
    <StudioBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        <View style={styles.topBar}>
          <ChunkyButton kind="icon" accessibilityLabel="Close lesson" onPress={router.back}>
            <Icon name="close" size={18} color={colors.onAction} />
          </ChunkyButton>
          <Text style={styles.title}>گوێ بگرە و بیدۆزەرەوە</Text>
          <View style={styles.chips}>
            <Chip accessibilityLabel={solved ? 'Step 4 of 8' : 'Step 3 of 8'}>
              <Meter progress={solved ? 4 / 8 : 3 / 8} />
              <Text style={textStyles.latinLabel}>{solved ? '4/8' : '3/8'}</Text>
            </Chip>
            <Chip accessibilityLabel="Stars">
              <Icon name="star" size={22} color={colors.action} outline={colors.actionEdge} />
              <Text style={textStyles.latinLabel}>{solved ? 13 : 12}</Text>
            </Chip>
          </View>
        </View>

        <View style={styles.stage}>
          <View style={styles.choices}>
            {CHOICES.map((wordId) => (
              <FrostedTile
                key={wordId}
                state={tileStateFor(wordId, solved, wrong)}
                width={tileWidth}
                accessibilityLabel={WORDS[wordId].meaning.en}
                onPress={() => {
                  choose(wordId);
                }}
                picture={(size) => <WordPicture wordId={wordId} size={size} />}
              />
            ))}
          </View>

          <View style={[styles.host, { width: kawWidth }]}>
            <Kaw pose={solved ? 'cheering' : 'speaking'} size={KAW_SIZE} />
            <View style={styles.hostAction}>
              {solved ? (
                <Animated.View key="next" entering={FadeIn.delay(300)} exiting={FadeOut}>
                  <ChunkyButton kind="pill" accessibilityLabel="Next" onPress={restart}>
                    <Text style={styles.pillText}>دواتر</Text>
                    <Icon name="next" size={20} color={colors.onAction} />
                  </ChunkyButton>
                </Animated.View>
              ) : (
                <Animated.View key="sound" entering={FadeIn} exiting={FadeOut}>
                  <ChunkyButton
                    kind="sound"
                    accessibilityLabel="Hear the word again"
                    onPress={sayTarget}
                  >
                    <Icon name="sound" size={30} color={colors.onAction} />
                  </ChunkyButton>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </View>
    </StudioBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    height: TOP_BAR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[3],
  },
  title: { ...textStyles.kurdishTitle, writingDirection: 'rtl' },
  chips: { flexDirection: 'row', gap: space[3] },
  stage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingBottom: space[4],
  },
  choices: { flexDirection: 'row', alignItems: 'flex-end', gap: space[5] },
  host: { alignItems: 'center' },
  hostAction: { position: 'absolute', left: 0, top: -space[3] },
  pillText: { ...textStyles.kurdishTitle, color: colors.onAction },
});
