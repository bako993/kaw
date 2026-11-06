import type { Easing } from './rig';

// These functions run on the UI thread (worklets). Two rules apply here:
// 1. Define helpers ABOVE the functions that use them. A worklet copies its helpers
//    when it is created, so a helper defined below it is still undefined at that moment.
// 2. Avoid array destructuring: it compiles to a helper that does not exist on that thread.

const NEWTON_STEPS = 8;
const BISECTION_STEPS = 24;
const PRECISION = 1e-6;

function bezierPoint(p1: number, p2: number, t: number): number {
  'worklet';
  const inverse = 1 - t;
  return 3 * p1 * inverse * inverse * t + 3 * p2 * inverse * t * t + t * t * t;
}

function bezierSlope(p1: number, p2: number, t: number): number {
  'worklet';
  const inverse = 1 - t;
  return 3 * p1 * inverse * inverse + 6 * (p2 - p1) * inverse * t + 3 * (1 - p2) * t * t;
}

function solveCurveTime(x1: number, x2: number, x: number): number {
  'worklet';
  let t = x;
  for (let step = 0; step < NEWTON_STEPS; step++) {
    const error = bezierPoint(x1, x2, t) - x;
    if (Math.abs(error) < PRECISION) return t;
    const slope = bezierSlope(x1, x2, t);
    if (Math.abs(slope) < PRECISION) break;
    t -= error / slope;
  }

  let low = 0;
  let high = 1;
  t = x;
  for (let step = 0; step < BISECTION_STEPS; step++) {
    const value = bezierPoint(x1, x2, t);
    if (Math.abs(value - x) < PRECISION) return t;
    if (value < x) low = t;
    else high = t;
    t = (low + high) / 2;
  }
  return t;
}

export function cubicBezier(easing: Easing, x: number): number {
  'worklet';
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const x1 = easing[0];
  const y1 = easing[1];
  const x2 = easing[2];
  const y2 = easing[3];
  return bezierPoint(y1, y2, solveCurveTime(x1, x2, x));
}
