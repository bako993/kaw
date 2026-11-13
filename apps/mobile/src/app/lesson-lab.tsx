import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWordSound, WordPicture, WORDS, type WordId } from '@/features/content';
import { Kaw } from '@/features/kaw';
import {
  formatNumber,
  formatText,
  isRightToLeft,
  useLanguage,
  type AppLanguage,
} from '@/platform/language';
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
const STEPS = 8;

/** What a screen reader says for a picture: the Kurdish word, or its meaning. */
function wordLabel(wordId: WordId, language: AppLanguage): string {
  const word = WORDS[wordId];
  return language === 'ckb' ? word.kurdish : word.meaning[language];
}

function tileStateFor(wordId: WordId, solved: boolean, wrong: readonly WordId[]): TileState {
  if (solved) return wordId === TARGET ? 'right' : 'dim';
  return wrong.includes(wordId) ? 'wrong' : 'idle';
}

export default function LessonLabScreen() {
  const router = useRouter();
  const { language, texts } = useLanguage();
  const t = texts.lesson;
  const readsRightToLeft = isRightToLeft(language);
  const titleStyle = readsRightToLeft ? textStyles.kurdishTitle : textStyles.latinTitle;
  const labelStyle = readsRightToLeft ? textStyles.kurdishLabel : textStyles.latinLabel;
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const sayTarget = useWordSound(TARGET);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<readonly WordId[]>([]);
  const step = solved ? 4 : 3;
  const stars = solved ? 13 : 12;

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
          <ChunkyButton kind="icon" accessibilityLabel={t.close} onPress={router.back}>
            <Icon name="close" size={18} color={colors.onAction} />
          </ChunkyButton>
          <Text style={titleStyle}>{t.listenAndFind}</Text>
          <View style={styles.chips}>
            <Chip
              accessibilityLabel={formatText(t.stepOf, { current: step, total: STEPS }, language)}
            >
              <Meter progress={step / STEPS} />
              <Text style={labelStyle}>
                {formatText('{current}/{total}', { current: step, total: STEPS }, language)}
              </Text>
            </Chip>
            <Chip accessibilityLabel={formatText(t.stars, { count: stars }, language)}>
              <Icon name="star" size={22} color={colors.action} outline={colors.actionEdge} />
              <Text style={labelStyle}>{formatNumber(stars, language)}</Text>
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
                accessibilityLabel={wordLabel(wordId, language)}
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
                  <ChunkyButton kind="pill" accessibilityLabel={t.next} onPress={restart}>
                    <Text style={[titleStyle, styles.onAction]}>{t.next}</Text>
                    <Icon
                      name="next"
                      size={20}
                      color={colors.onAction}
                      mirrored={!readsRightToLeft}
                    />
                  </ChunkyButton>
                </Animated.View>
              ) : (
                <Animated.View key="sound" entering={FadeIn} exiting={FadeOut}>
                  <ChunkyButton kind="sound" accessibilityLabel={t.hearAgain} onPress={sayTarget}>
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
  onAction: { color: colors.onAction },
});
