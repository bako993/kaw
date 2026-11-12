import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../tokens/colors';
import { elevation } from '../tokens/elevation';
import { radius, space } from '../tokens/layout';

export interface ChipProps {
  /** What the chip shows, read as one item by screen readers (e.g. "Step 3 of 8"). */
  readonly accessibilityLabel: string;
  readonly children: ReactNode;
}

/** A paper-white pill with a warm edge, for small status info (step, stars). */
export function Chip({ accessibilityLabel, children }: ChipProps) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3] + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    boxShadow: `0px 3px 0px ${colors.paperEdge}, ${elevation.soft}`,
  },
});
