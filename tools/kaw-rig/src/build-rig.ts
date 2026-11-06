import { parseAnimation, parseTime } from './css/parse-animation.ts';
import { parseKeyframes } from './css/parse-keyframes.ts';
import {
  declarationsForClasses,
  readClassRules,
  readDeclarations,
  type Declarations,
} from './css/read-declarations.ts';
import type { Animated, Keyframe, Motion, MovingPart, Pivot, Shape, Sparkle } from './rig-types.ts';
import type { KawRig } from './rig-types.ts';
import type { PackSvg } from './svg/read-pack-svg.ts';

const POSE_SIZE = 1024;

export function buildRig(pack: PackSvg): KawRig {
  const keyframes = parseKeyframes(pack.css);
  const classRules = readClassRules(pack.css);
  const animate = (declarations: Declarations): Animated => ({
    pivot: readPivot(declarations.get('transform-origin')),
    motion: readMotion(declarations, keyframes),
  });

  const overlay: Shape[] = [];
  const parts: MovingPart[] = [];
  const sparkles: Sparkle[] = [];

  for (const element of pack.elements) {
    if (element.kind === 'shape') {
      overlay.push(element.shape);
    } else if (element.kind === 'part') {
      const clip = pack.clips.get(element.clipId);
      if (!clip) throw new Error(`Missing clip "${element.clipId}"`);
      parts.push({ clip, ...animate(readDeclarations(element.style)) });
    } else if (element.kind === 'group') {
      const declarations = declarationsForClasses(classRules, element.className);
      sparkles.push({ shapes: element.shapes, ...animate(declarations) });
    }
  }

  return {
    size: POSE_SIZE,
    artSvg: pack.artSvg,
    body: animate(readDeclarations(pack.bodyStyle)),
    overlay,
    parts,
    sparkles,
  };
}

function readMotion(
  declarations: Declarations,
  keyframes: ReadonlyMap<string, readonly Keyframe[]>,
): Motion | null {
  const shorthand = declarations.get('animation');
  if (shorthand === undefined || shorthand === 'none') return null;

  const spec = parseAnimation(shorthand);
  const frames = keyframes.get(spec.name);
  if (!frames) throw new Error(`Missing @keyframes "${spec.name}"`);

  const delay = declarations.get('animation-delay');
  return {
    keyframes: frames,
    durationMs: spec.durationMs,
    delayMs: delay === undefined ? spec.delayMs : (parseTime(delay) ?? 0),
    alternate: spec.alternate,
    easing: spec.easing,
  };
}

function readPivot(origin: string | undefined): Pivot {
  if (origin === undefined) return { kind: 'point', point: [0, 0] };
  if (origin === 'center') return { kind: 'center' };

  const [x = 0, y = 0] = origin.split(/\s+/).map((part) => Number.parseFloat(part));
  return { kind: 'point', point: [x, y] };
}
