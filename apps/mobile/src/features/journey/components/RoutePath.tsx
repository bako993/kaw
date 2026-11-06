import { DashPathEffect, Group, Path } from '@shopify/react-native-skia';

import type { Route } from '../model/route';

interface RoutePathProps {
  readonly route: Route;
  /** How far Kaw has walked, in ground units along the route. */
  readonly walked: number;
}

/** The paved path between stops; the walked part glows gold. Drawn in code, never painted (D5). */
export function RoutePath({ route, walked }: RoutePathProps) {
  const walkedShare = route.length > 0 ? walked / route.length : 0;
  const line = {
    path: route.path,
    style: 'stroke',
    strokeCap: 'round',
    strokeJoin: 'round',
  } as const;

  return (
    <Group>
      <Path {...line} color="#CDB68A" opacity={0.9} strokeWidth={30} />
      <Path {...line} color="#F8F0DE" strokeWidth={22} />
      <Path {...line} color="#DCC8A2" strokeWidth={4}>
        <DashPathEffect intervals={[0.1, 20]} />
      </Path>
      <Path {...line} color="#F6D68A" opacity={0.55} strokeWidth={26} end={walkedShare} />
      <Path {...line} color="#EDAE3F" strokeWidth={11} end={walkedShare} />
    </Group>
  );
}
