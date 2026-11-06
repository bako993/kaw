import type { Easing } from '../rig-types.ts';

export interface AnimationSpec {
  readonly name: string;
  readonly durationMs: number;
  readonly delayMs: number;
  readonly alternate: boolean;
  readonly easing: Easing;
}

const NAMED_EASINGS: Readonly<Record<string, Easing>> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

const IGNORED_KEYWORDS = new Set(['infinite', 'normal', 'both', 'forwards', 'backwards', 'none']);

export function parseAnimation(shorthand: string): AnimationSpec {
  const times: number[] = [];
  let name = '';
  let alternate = false;
  let easing: Easing = NAMED_EASINGS.ease ?? [0.25, 0.1, 0.25, 1];

  for (const token of splitTokens(shorthand)) {
    const time = parseTime(token);
    const named = NAMED_EASINGS[token];
    if (time !== null) times.push(time);
    else if (named) easing = named;
    else if (token.startsWith('cubic-bezier(')) easing = parseCubicBezier(token);
    else if (token === 'alternate') alternate = true;
    else if (!IGNORED_KEYWORDS.has(token)) name = token;
  }

  const [durationMs, delayMs = 0] = times;
  if (name === '' || durationMs === undefined) {
    throw new Error(`Cannot read animation "${shorthand}"`);
  }

  return { name, durationMs, delayMs, alternate, easing };
}

export function parseTime(token: string): number | null {
  const match = /^(-?[\d.]+)(ms|s)$/.exec(token);
  if (!match) return null;
  const value = Number.parseFloat(match[1] ?? '0');
  return match[2] === 's' ? value * 1000 : value;
}

function splitTokens(shorthand: string): string[] {
  return shorthand.match(/[\w-]+\([^)]*\)|[^\s]+/g) ?? [];
}

function parseCubicBezier(token: string): Easing {
  const numbers = token
    .slice('cubic-bezier('.length, -1)
    .split(',')
    .map((part) => Number.parseFloat(part));
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = numbers;
  return [x1, y1, x2, y2];
}
