import { Canvas, Fill, Group } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useGroundPicture } from '../hooks/use-ground-picture';
import { useMapCamera } from '../hooks/use-map-camera';
import type { Viewport } from '../model/camera';
import type { City } from '../model/city';
import { SCENE_BACKGROUND } from '../model/ground-style';
import { buildRoute } from '../model/route';
import { stopStateFor } from '../model/stop-style';

import { CityGroundLayer } from './CityGroundLayer';
import { GroundBackdrop } from './GroundBackdrop';
import { GroundEdgeFade } from './GroundEdgeFade';
import { LandmarkSite } from './LandmarkSite';
import { LandmarkSticker } from './LandmarkSticker';
import { MapAtmosphere } from './MapAtmosphere';
import { RoutePath } from './RoutePath';
import { RouteStopMark } from './RouteStopMark';

interface MapSceneProps {
  readonly city: City;
  readonly viewport: Viewport;
  /** Index of the current stop; stops before it are done. */
  readonly progress: number;
}

/** Layer order (D5): ground → path → courtyards → stops → landmarks → haze. */
export function MapScene({ city, viewport, progress }: MapSceneProps) {
  const { limits, start } = city.camera;
  const { camera, matrix, groundClip, gesture, settled } = useMapCamera(start, limits, viewport);
  const picture = useGroundPicture(city.ground);
  const route = useMemo(() => buildRoute(city.route), [city.route]);
  const groundBounds = useMemo(
    () => ({ x: 0, y: 0, width: city.ground.width, height: city.ground.height }),
    [city.ground],
  );
  const stickers = useMemo(() => [...city.landmarks].sort((a, b) => a.y - b.y), [city.landmarks]);
  const walked = route.stops[progress]?.distance ?? route.length;

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.fill}>
        <Canvas style={styles.fill}>
          <Fill color={SCENE_BACKGROUND} />
          <Group matrix={matrix} clip={groundClip}>
            <GroundBackdrop ground={city.ground} />
            <CityGroundLayer
              picture={picture}
              groundBounds={groundBounds}
              camera={camera}
              settled={settled}
              limits={limits}
              viewport={viewport}
            />
            <GroundEdgeFade ground={city.ground} />
            <RoutePath route={route} walked={walked} />
            {city.landmarks.map((landmark) => (
              <LandmarkSite key={landmark.id} landmark={landmark} />
            ))}
            {route.stops.map((stop, index) => (
              <RouteStopMark
                key={index}
                x={stop.x}
                y={stop.y}
                state={stopStateFor(index, progress)}
              />
            ))}
          </Group>
          {stickers.map((landmark) => (
            <LandmarkSticker key={landmark.id} landmark={landmark} matrix={matrix} />
          ))}
          <MapAtmosphere viewport={viewport} camera={camera} limits={limits} />
        </Canvas>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
