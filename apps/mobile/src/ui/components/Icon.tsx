import { Canvas, Group, Path, Skia, type SkPath } from '@shopify/react-native-skia';

interface IconShape {
  readonly path: SkPath;
  readonly strokeWidth: number;
  readonly filled: boolean;
}

function shape(svgPath: string, strokeWidth: number, filled = false): IconShape {
  const path = Skia.Path.MakeFromSVGString(svgPath);
  if (!path) throw new Error(`Icon path is not valid SVG: ${svgPath}`);
  return { path, strokeWidth, filled };
}

/** Kaw's icons, drawn on a 24 × 24 grid (same shapes as the approved C2 mockup). */
const ICONS = {
  close: [shape('M6 6l12 12M18 6L6 18', 3)],
  sound: [
    shape('M4 9.5h3l4.5-4v13l-4.5-4H4z', 2.3, true),
    shape('M15.5 9a4 4 0 0 1 0 6', 2.3),
    shape('M18.5 6.5a7.5 7.5 0 0 1 0 11', 2.3),
  ],
  /** "Forward" in Kurdish: points left. Pass `mirrored` for left-to-right languages. */
  next: [shape('M14 6l-6 6 6 6', 3.2)],
  check: [shape('M5 12.5l4.5 4.5L19 7.5', 3.6)],
  star: [
    shape('M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1L3.2 9.3l6.1-.9z', 1.2, true),
  ],
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  readonly name: IconName;
  readonly size: number;
  readonly color: string;
  /** Outline colour for filled shapes (e.g. the star's darker edge). Defaults to `color`. */
  readonly outline?: string;
  /** Flips the icon left ↔ right (e.g. "next" for languages read left to right). */
  readonly mirrored?: boolean;
}

/** A small decorative icon. The button or chip around it carries the screen-reader label. */
export function Icon({ name, size, color, outline = color, mirrored = false }: IconProps) {
  return (
    <Canvas
      style={{ width: size, height: size, transform: [{ scaleX: mirrored ? -1 : 1 }] }}
      pointerEvents="none"
    >
      <Group transform={[{ scale: size / 24 }]}>
        {ICONS[name].map((part, index) => (
          <Group key={index}>
            {part.filled && <Path path={part.path} color={color} />}
            <Path
              path={part.path}
              color={outline}
              style="stroke"
              strokeWidth={part.strokeWidth}
              strokeCap="round"
              strokeJoin="round"
            />
          </Group>
        ))}
      </Group>
    </Canvas>
  );
}
