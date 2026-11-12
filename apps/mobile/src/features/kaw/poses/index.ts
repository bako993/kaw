import { bundledAsset, type BundledAsset } from '@/platform/assets/bundled-asset';

/** How Kaw moves when he switches to a pose. */
export type PoseEntrance = 'fade' | 'hop';

export interface KawPoseArt {
  readonly file: BundledAsset;
  readonly entrance: PoseEntrance;
}

/** Every pose file is 1280 × 1024: width to height. */
export const KAW_ART_ASPECT = 1280 / 1024;

/** Where his feet touch the ground, as a share of the frame height (992 of 1024 px). */
export const KAW_FEET_LINE = 992 / 1024;

/**
 * Kaw's 3D poses in assets/kaw/. All share one framing (same size, eyes and feet
 * on the same lines), so switching between poses never makes him jump.
 */
export const KAW_POSES = {
  happy: { file: bundledAsset(require('@/assets/kaw/happy.webp')), entrance: 'fade' },
  curious: { file: bundledAsset(require('@/assets/kaw/curious.webp')), entrance: 'fade' },
  proud: { file: bundledAsset(require('@/assets/kaw/proud.webp')), entrance: 'fade' },
  gentle: { file: bundledAsset(require('@/assets/kaw/gentle.webp')), entrance: 'fade' },
  surprised: { file: bundledAsset(require('@/assets/kaw/surprised.webp')), entrance: 'fade' },
  sleepy: { file: bundledAsset(require('@/assets/kaw/sleepy.webp')), entrance: 'fade' },
  waving: { file: bundledAsset(require('@/assets/kaw/waving.webp')), entrance: 'fade' },
  listening: { file: bundledAsset(require('@/assets/kaw/listening.webp')), entrance: 'fade' },
  speaking: { file: bundledAsset(require('@/assets/kaw/speaking.webp')), entrance: 'fade' },
  pointing: { file: bundledAsset(require('@/assets/kaw/pointing.webp')), entrance: 'fade' },
  cheering: { file: bundledAsset(require('@/assets/kaw/cheering.webp')), entrance: 'hop' },
  thinking: { file: bundledAsset(require('@/assets/kaw/thinking.webp')), entrance: 'fade' },
} as const satisfies Record<string, KawPoseArt>;

export type KawPose = keyof typeof KAW_POSES;
