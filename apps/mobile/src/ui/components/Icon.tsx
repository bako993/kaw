import { Image } from 'expo-image';

import { bundledAsset } from '@/platform/assets/bundled-asset';

/**
 * Kaw's icons: small SVG files in assets/icons/ (24 × 24 grid, same shapes as the C2 mockup).
 * Their colours are `var(--color)` and `var(--outline)`, filled in by `Icon`.
 * Adding an icon: draw the SVG with those two variables, then add one line here.
 */
const ICONS = {
  close: bundledAsset(require('@/assets/icons/close.svg')),
  sound: bundledAsset(require('@/assets/icons/sound.svg')),
  /** "Forward" in Kurdish: points left. Pass `mirrored` for left-to-right languages. */
  next: bundledAsset(require('@/assets/icons/next.svg')),
  check: bundledAsset(require('@/assets/icons/check.svg')),
  star: bundledAsset(require('@/assets/icons/star.svg')),
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  readonly name: IconName;
  readonly size: number;
  readonly color: string;
  /** Outline colour for icons that have one (e.g. the star's darker edge). Defaults to `color`. */
  readonly outline?: string;
  /** Flips the icon left ↔ right (e.g. "next" for languages read left to right). */
  readonly mirrored?: boolean;
}

/** A small decorative icon. The button or chip around it carries the screen-reader label. */
export function Icon({ name, size, color, outline = color, mirrored = false }: IconProps) {
  return (
    <Image
      source={ICONS[name]}
      svgVariables={{ '--color': color, '--outline': outline }}
      contentFit="contain"
      style={{ width: size, height: size, transform: [{ scaleX: mirrored ? -1 : 1 }] }}
      accessible={false}
      pointerEvents="none"
    />
  );
}
