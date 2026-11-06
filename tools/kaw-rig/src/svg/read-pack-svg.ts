import type { FillShape, Point, Shape } from '../rig-types.ts';

import { parsePoints, polygonToPath } from './geometry.ts';
import { readAttributes, requireAttribute } from './read-attributes.ts';

export type PackElement =
  | { readonly kind: 'base' }
  | { readonly kind: 'shape'; readonly shape: Shape }
  | { readonly kind: 'part'; readonly clipId: string; readonly style: string }
  | { readonly kind: 'group'; readonly className: string; readonly shapes: readonly FillShape[] };

export interface PackSvg {
  readonly css: string;
  readonly artSvg: string;
  readonly clips: ReadonlyMap<string, readonly Point[]>;
  readonly bodyStyle: string;
  readonly elements: readonly PackElement[];
}

const ELEMENT_PATTERN = /<(use|path|polygon)\b([^>]*?)\/>|<g\b([^>]*)>([\s\S]*?)<\/g>/g;

export function readPackSvg(svg: string): PackSvg {
  const body = /<\/defs><g style="([^"]*)">([\s\S]*)<\/g><\/svg>\s*$/.exec(svg);
  if (!body) {
    throw new Error('Unknown pose structure: expected one animated body group after <defs>');
  }

  return {
    css: /<style>([\s\S]*?)<\/style>/.exec(svg)?.[1] ?? '',
    artSvg: readArtSvg(svg),
    clips: readClips(svg),
    bodyStyle: body[1] ?? '',
    elements: readElements(body[2] ?? ''),
  };
}

function readArtSvg(svg: string): string {
  const art = /<symbol id="[\w-]+-art" viewBox="([^"]*)">([\s\S]*?)<\/symbol>/.exec(svg);
  if (!art) {
    throw new Error('Missing the <symbol> with the Kaw drawing');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${art[1] ?? ''}">${art[2] ?? ''}</svg>`;
}

function readClips(svg: string): ReadonlyMap<string, readonly Point[]> {
  const clips = new Map<string, readonly Point[]>();
  const pattern = /<clipPath id="([^"]+)"><polygon points="([^"]+)"\/><\/clipPath>/g;
  for (const [, id = '', points = ''] of svg.matchAll(pattern)) {
    clips.set(id, parsePoints(points));
  }
  return clips;
}

function readElements(inner: string): PackElement[] {
  const elements: PackElement[] = [];

  for (const [, tag, tagAttributes = '', groupAttributes, groupInner = ''] of inner.matchAll(
    ELEMENT_PATTERN,
  )) {
    if (groupAttributes !== undefined) {
      elements.push(readGroup(groupAttributes, groupInner));
    } else if (tag === 'use') {
      elements.push(readUse(tagAttributes));
    } else {
      elements.push({ kind: 'shape', shape: readShape(tag ?? '', tagAttributes) });
    }
  }

  return elements;
}

function readUse(rawAttributes: string): PackElement {
  const attributes = readAttributes(rawAttributes);
  if (attributes.has('mask')) {
    return { kind: 'base' };
  }

  const clip = /url\(#([^)]+)\)/.exec(requireAttribute(attributes, 'clip-path'));
  return {
    kind: 'part',
    clipId: clip?.[1] ?? '',
    style: requireAttribute(attributes, 'style'),
  };
}

function readShape(tag: string, rawAttributes: string): Shape {
  const attributes = readAttributes(rawAttributes);
  const fill = attributes.get('fill');

  if (fill === 'none') {
    return {
      kind: 'stroke',
      d: requireAttribute(attributes, 'd'),
      color: requireAttribute(attributes, 'stroke'),
      width: Number(requireAttribute(attributes, 'stroke-width')),
    };
  }

  const d =
    tag === 'polygon'
      ? polygonToPath(parsePoints(requireAttribute(attributes, 'points')))
      : requireAttribute(attributes, 'd');
  return { kind: 'fill', d, color: fill ?? '#000000' };
}

function readGroup(rawAttributes: string, inner: string): PackElement {
  const className = readAttributes(rawAttributes).get('class') ?? '';
  const shapes: FillShape[] = [];

  for (const [, rawShape = ''] of inner.matchAll(/<path\b([^>]*?)\/>/g)) {
    const shape = readShape('path', rawShape);
    if (shape.kind !== 'fill') {
      throw new Error('Only filled shapes are supported inside a moving group');
    }
    shapes.push(shape);
  }

  return { kind: 'group', className, shapes };
}
