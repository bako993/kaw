import { Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';

import type { Landmark } from '../model/city';

interface LandmarkSiteProps {
  readonly landmark: Landmark;
}

const COURTYARD = ['#F1E6CF', '#EFE3CA', 'rgba(239, 227, 202, 0.85)', 'rgba(239, 227, 202, 0)'];
const COURTYARD_STOPS = [0, 0.58, 0.72, 1];
const SHADOW = ['rgba(74, 56, 32, 0.3)', 'rgba(74, 56, 32, 0)'];

function SoftEllipse(props: {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly colors: string[];
  readonly positions?: number[];
}) {
  const radius = props.width / 2;
  return (
    <Group
      transform={[
        { translateX: props.x },
        { translateY: props.y },
        { scaleY: props.height / props.width },
      ]}
    >
      <Circle r={radius}>
        <RadialGradient
          c={vec(0, 0)}
          r={radius}
          colors={props.colors}
          positions={props.positions}
        />
      </Circle>
    </Group>
  );
}

/** The paved courtyard and soft shadow on the ground under a landmark. */
export function LandmarkSite({ landmark }: LandmarkSiteProps) {
  const { x, y, width, site } = landmark;
  return (
    <Group>
      <SoftEllipse
        x={x}
        y={y - site.height * 0.06}
        width={site.width}
        height={site.height}
        colors={COURTYARD}
        positions={COURTYARD_STOPS}
      />
      <SoftEllipse x={x} y={y} width={width * 1.07} height={width * 0.27} colors={SHADOW} />
    </Group>
  );
}
