import { StyleSheet, Text, View } from 'react-native';

import { JourneyMap } from '@/features/journey';
import { FrameRateBadge } from '@/platform/performance/FrameRateBadge';

export default function MapLabScreen() {
  return (
    <View style={styles.root}>
      <JourneyMap cityId="silemani" progress={2} />
      <FrameRateBadge />
      <Text style={styles.credit}>© OpenStreetMap</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E8DDC6' },
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
