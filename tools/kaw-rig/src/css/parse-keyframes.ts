import type { Frame, Keyframe } from '../rig-types.ts';

import { IDENTITY_FRAME, parseTransform } from './parse-transform.ts';

const KEYFRAMES_PATTERN = /@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^}]*\})*)\s*\}/g;
const STOP_PATTERN = /([^{}]+)\{([^}]*)\}/g;

export function parseKeyframes(css: string): ReadonlyMap<string, readonly Keyframe[]> {
  const result = new Map<string, readonly Keyframe[]>();

  for (const [, name = '', body = ''] of css.matchAll(KEYFRAMES_PATTERN)) {
    result.set(name, parseStops(body));
  }

  return result;
}

function parseStops(body: string): readonly Keyframe[] {
  const keyframes: Keyframe[] = [];

  for (const [, selectors = '', declarations = ''] of body.matchAll(STOP_PATTERN)) {
    const frame = parseFrame(declarations);
    for (const selector of selectors.split(',')) {
      keyframes.push({ offset: parseOffset(selector.trim()), frame });
    }
  }

  return keyframes.sort((a, b) => a.offset - b.offset);
}

function parseFrame(declarations: string): Frame {
  let frame: Frame = IDENTITY_FRAME;

  for (const declaration of declarations.split(';')) {
    const [property = '', value = ''] = declaration.split(':').map((part) => part.trim());
    if (property === 'transform') {
      frame = { ...frame, ...parseTransform(value) };
    } else if (property === 'opacity') {
      frame = { ...frame, opacity: Number.parseFloat(value) };
    }
  }

  return frame;
}

function parseOffset(selector: string): number {
  if (selector === 'from') return 0;
  if (selector === 'to') return 1;
  if (selector.endsWith('%')) return Number.parseFloat(selector) / 100;
  throw new Error(`Unknown keyframe selector "${selector}"`);
}
