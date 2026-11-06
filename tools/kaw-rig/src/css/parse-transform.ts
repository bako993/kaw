import type { Frame } from '../rig-types.ts';

export const IDENTITY_FRAME: Frame = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
};

type FrameChange = Partial<Frame>;

const FUNCTION_PATTERN = /([a-zA-Z]+)\(([^)]*)\)/g;

export function parseTransform(value: string): FrameChange {
  const change: { -readonly [K in keyof Frame]?: number } = {};

  for (const [, name = '', rawArgs = ''] of value.matchAll(FUNCTION_PATTERN)) {
    const args = rawArgs
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(parseLength);
    Object.assign(change, applyFunction(name, args));
  }

  return change;
}

function applyFunction(name: string, args: readonly number[]): FrameChange {
  const [first = 0, second] = args;

  switch (name) {
    case 'translate':
      return { translateX: first, translateY: second ?? 0 };
    case 'translateX':
      return { translateX: first };
    case 'translateY':
      return { translateY: first };
    case 'rotate':
      return { rotate: first };
    case 'scale':
      return { scaleX: first, scaleY: second ?? first };
    case 'scaleX':
      return { scaleX: first };
    case 'scaleY':
      return { scaleY: first };
    default:
      throw new Error(`Unsupported transform function "${name}"`);
  }
}

function parseLength(raw: string): number {
  if (raw.endsWith('%')) {
    throw new Error(`Percentage values are not supported yet: "${raw}"`);
  }
  return Number.parseFloat(raw);
}
