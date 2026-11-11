import { bundledAsset, type BundledAsset } from '@/platform/assets/bundled-asset';

/** How Kaw moves when he switches to a pose. */
export type PoseEntrance = 'fade' | 'hop';

export interface KawPoseArt {
  readonly file: BundledAsset;
  readonly entrance: PoseEntrance;
}

/** Every pose file is 1280 × 1024: width to height. */
export const KAW_ART_ASPECT = 1280 / 1024;

/**
 * Kaw's 3D poses in assets/kaw/. All share one framing (same size, eyes and feet
 * on the same lines), so switching between poses never makes him jump.
 */
export const KAW_POSES = {
  happy: { file: bundledAsset(require('@/assets/kaw/happy.webp')), entrance: 'fade' },
  waving: { file: bundledAsset(require('@/assets/kaw/waving.webp')), entrance: 'fade' },
  speaking: { file: bundledAsset(require('@/assets/kaw/speaking.webp')), entrance: 'fade' },
  listening: { file: bundledAsset(require('@/assets/kaw/listening.webp')), entrance: 'fade' },
  pointing: { file: bundledAsset(require('@/assets/kaw/pointing.webp')), entrance: 'fade' },
  cheering: { file: bundledAsset(require('@/assets/kaw/cheering.webp')), entrance: 'hop' },
} as const satisfies Record<string, KawPoseArt>;

export type KawPose = keyof typeof KAW_POSES;
