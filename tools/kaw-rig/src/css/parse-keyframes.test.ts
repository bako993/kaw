import { describe, expect, it } from 'vitest';

import { parseKeyframes } from './parse-keyframes.ts';

describe('parseKeyframes', () => {
  it('reads shared selectors and sorts the stops', () => {
    const css = '@keyframes hop{0%,to{transform:translateY(0)}50%{transform:translateY(-40px)}}';
    const hop = parseKeyframes(css).get('hop');

    expect(hop?.map((stop) => [stop.offset, stop.frame.translateY])).toEqual([
      [0, 0],
      [0.5, -40],
      [1, 0],
    ]);
  });

  it('reads opacity next to transforms', () => {
    const css = '@keyframes star{0%{transform:scale(.6);opacity:.45}to{opacity:1}}';
    const star = parseKeyframes(css).get('star');

    expect(star?.[0]?.frame).toMatchObject({ scaleX: 0.6, opacity: 0.45 });
    expect(star?.[1]?.frame).toMatchObject({ scaleX: 1, opacity: 1 });
  });
});
