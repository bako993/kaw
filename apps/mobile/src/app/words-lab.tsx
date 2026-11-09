import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TOPICS, WordPicture, WORDS } from '@/features/content';

const topic = TOPICS['hello-and-me'];

export default function WordsLabScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.grid}>
      {topic.words['6-10'].map((wordId) => (
        <View key={wordId} style={styles.card}>
          <WordPicture wordId={wordId} size={140} />
          <Text style={styles.kurdish}>{WORDS[wordId].kurdish}</Text>
          <Text style={styles.soundsLike}>{WORDS[wordId].soundsLike}</Text>
        </View>
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
