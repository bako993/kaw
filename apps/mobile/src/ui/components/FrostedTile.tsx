import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useTileMotion, type TileState } from '../hooks/use-tile-motion';
import { colors } from '../tokens/colors';
import { elevation } from '../tokens/elevation';
import { radius } from '../tokens/layout';
import { Icon } from './Icon';

export interface FrostedTileProps {
  readonly state: TileState;
  readonly width: number;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  /** Draws the picture at the given size; it stands on the tile and pops out of its top. */
  readonly picture: (size: number) => ReactNode;
}

// Proportions of the approved C2 mockup (a 172-wide tile).
const HEIGHT = 272 / 172;
const TILE_HEIGHT = 190 / 172;
const PICTURE = 222 / 172;
const BADGE = 40;

/** A milky glass answer tile. Right: green ring + check. Wrong: a gentle shake, then fades. */
export function FrostedTile({
  state,
  width,
  accessibilityLabel,
  onPress,
  picture,
}: FrostedTileProps) {
  const { tileStyle, successRingStyle, badgeStyle, squeeze } = useTileMotion(state);
  const tileSize = { height: width * TILE_HEIGHT };
  const pictureSize = width * PICTURE;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        squeeze(true);
      }}
      onPressOut={() => {
        squeeze(false);
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: state === 'right', disabled: state === 'dim' }}
    >
      <Animated.View style={[{ width, height: width * HEIGHT }, tileStyle]}>
        <View style={[styles.glass, tileSize]} />
        <Animated.View style={[styles.successRing, tileSize, successRingStyle]} />
        <View style={[styles.picture, { width: pictureSize, marginLeft: -pictureSize / 2 }]}>
          {picture(pictureSize)}
        </View>
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Icon name="check" size={18} color={colors.white} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const tilePlace = {
  position: 'absolute',
  left: 6,
  right: 6,
  bottom: 0,
  borderRadius: radius.large,
} as const;

const styles = StyleSheet.create({
  glass: {
    ...tilePlace,
    borderWidth: 1.5,
    borderColor: colors.frostEdge,
    backgroundImage: `linear-gradient(160deg, ${colors.frostTop} 0%, ${colors.frostBottom} 100%)`,
    boxShadow: `inset 0px 1px 0px ${colors.white}, inset 0px -18px 30px -12px ${colors.topicGlow}, ${elevation.float}`,
  },
  successRing: {
    ...tilePlace,
    borderWidth: 2.5,
    borderColor: colors.success,
    boxShadow: `0px 0px 0px 5px ${colors.successHalo}`,
  },
  picture: { position: 'absolute', left: '50%', bottom: 0, alignItems: 'center' },
  badge: {
    position: 'absolute',
    right: 8,
    top: 34,
    width: BADGE,
    height: BADGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.paper,
    backgroundImage: `linear-gradient(180deg, ${colors.successLight} 0%, ${colors.success} 100%)`,
    boxShadow: `0px 4px 0px ${colors.successEdge}`,
  },
});
