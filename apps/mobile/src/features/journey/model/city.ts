import type { CityGround } from '@kaw/shared';
import type { DataModule } from '@shopify/react-native-skia';

import type { CameraLimits, CameraState } from './camera';
import type { RoutePoint } from './route';

export interface Landmark {
  readonly id: string;
  /** Where the landmark stands on the ground (bottom centre of the sticker). */
  readonly x: number;
  readonly y: number;
  /** Sticker width in ground units. */
  readonly width: number;
  readonly image: DataModule;
  /** The paved courtyard under the landmark, in ground units. */
  readonly site: { readonly width: number; readonly height: number };
}

export interface City {
  readonly id: string;
  readonly ground: CityGround;
  readonly camera: { readonly start: CameraState; readonly limits: CameraLimits };
  readonly route: readonly RoutePoint[];
  readonly landmarks: readonly Landmark[];
}
