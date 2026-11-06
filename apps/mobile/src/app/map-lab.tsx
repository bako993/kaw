import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { JourneyMap } from '@/features/journey';
import { useFrameRate } from '@/platform/performance/use-frame-rate';

export default function MapLabScreen() {
  const { fps, slowestMs } = useFrameRate();

  return (
    <GestureHandlerRootView style={styles.root}>
      <JourneyMap cityId="silemani" progress={2} />

      <View style={styles.toolbar} pointerEvents="none">
        <Text style={styles.stats}>
          {fps} fps · slowest {slowestMs} ms
        </Text>
      </View>

      <Text style={styles.credit}>© OpenStreetMap</Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E8DDC6' },
  toolbar: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  stats: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 250, 240, 0.95)',
    fontSize: 13,
    fontWeight: '700',
    color: '#4A3F35',
    fontVariant: ['tabular-nums'],
  },
  credit: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(250, 244, 232, 0.8)',
    fontSize: 10,
    fontWeight: '700',
    color: '#6E5F51',
  },
});
