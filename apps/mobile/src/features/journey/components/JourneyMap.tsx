import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { cities, type CityId } from '../cities';
import type { Viewport } from '../model/camera';

import { MapScene } from './MapScene';

export interface JourneyMapProps {
  readonly cityId: CityId;
  readonly progress: number;
}

/** Measures the space it gets, then shows the city map in it. */
export function JourneyMap({ cityId, progress }: JourneyMapProps) {
  const [viewport, setViewport] = useState<Viewport | null>(null);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setViewport((current) =>
      current?.width === width && current.height === height ? current : { width, height },
    );
  };

  return (
    <View style={styles.fill} onLayout={onLayout}>
      {viewport && (
        <MapScene
          key={`${String(viewport.width)}x${String(viewport.height)}`}
          city={cities[cityId]}
          viewport={viewport}
          progress={progress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
