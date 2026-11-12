import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../tokens/colors';

export interface StudioBackgroundProps {
  /** The topic's soft light at the top of the screen. */
  readonly glow?: string;
  readonly children?: ReactNode;
}

/** The warm "studio" behind every lesson: oat colours with a soft topic light on top. */
export function StudioBackground({ glow = colors.topicGlow, children }: StudioBackgroundProps) {
  const light = `radial-gradient(ellipse 70% 55% at 50% 0%, ${glow} 0%, transparent 100%)`;
  const studio = `linear-gradient(180deg, ${colors.backgroundTop} 0%, ${colors.backgroundBottom} 100%)`;

  return <View style={[styles.fill, { backgroundImage: `${light}, ${studio}` }]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.backgroundTop },
});
