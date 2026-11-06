export type StopState = 'done' | 'current' | 'locked';

export interface StopColors {
  readonly base: string;
  readonly rim: string;
  readonly inner: string;
  readonly star: string;
  readonly core: string;
}

const GOLD = { base: '#C68F34', rim: '#F2D186', inner: '#FFF3D8', core: '#FFF8E6' };

export const STOP_COLORS: Readonly<Record<StopState, StopColors>> = {
  done: { ...GOLD, star: '#E8A93C' },
  current: { ...GOLD, star: '#F2B33D' },
  locked: { base: '#CDBEA2', rim: '#E6DCC8', inner: '#F2EBDE', star: '#DDD1BA', core: '#E8DFCC' },
};

export const HALO_COLOR = 'rgba(242, 179, 61, 0.85)';

export function stopStateFor(index: number, progress: number): StopState {
  if (index < progress) return 'done';
  return index === progress ? 'current' : 'locked';
}

/** A Kurdish 8-point star as an SVG path, centred on 0,0. */
export function starPath(outerRadius: number, innerRadius: number, points = 8): string {
  const corners = Array.from({ length: points * 2 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    return `${(radius * Math.cos(angle)).toFixed(1)} ${(radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${corners.join('L')}Z`;
}
