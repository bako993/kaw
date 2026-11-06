export type Point = readonly [number, number];

export interface Frame {
  readonly translateX: number;
  readonly translateY: number;
  readonly rotate: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly opacity: number;
}

export interface Keyframe {
  readonly offset: number;
  readonly frame: Frame;
}

export type Easing = readonly [number, number, number, number];

export interface Motion {
  readonly keyframes: readonly Keyframe[];
  readonly durationMs: number;
  readonly delayMs: number;
  readonly alternate: boolean;
  readonly easing: Easing;
}

export type Pivot = { readonly kind: 'point'; readonly point: Point } | { readonly kind: 'center' };

export interface Animated {
  readonly pivot: Pivot;
  readonly motion: Motion | null;
}

export interface FillShape {
  readonly kind: 'fill';
  readonly d: string;
  readonly color: string;
}

export interface StrokeShape {
  readonly kind: 'stroke';
  readonly d: string;
  readonly color: string;
  readonly width: number;
}

export type Shape = FillShape | StrokeShape;

export interface MovingPart extends Animated {
  readonly clip: readonly Point[];
}

export interface Sparkle extends Animated {
  readonly shapes: readonly FillShape[];
}

export interface KawRig {
  readonly size: number;
  readonly artSvg: string;
  readonly body: Animated;
  readonly overlay: readonly Shape[];
  readonly parts: readonly MovingPart[];
  readonly sparkles: readonly Sparkle[];
}
