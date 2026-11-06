import type { City } from '../../model/city';

import { silemaniGround } from './silemani-ground.generated';

const stop = (x: number, y: number) => ({ x, y, isStop: true });
const bend = (x: number, y: number) => ({ x, y, isStop: false });

export const silemani: City = {
  id: 'silemani',
  ground: silemaniGround,
  camera: {
    start: { focusX: 1310, focusY: 1105, zoom: 0.9 },
    limits: {
      minZoom: 0.24,
      maxZoom: 1.35,
      minTiltDegrees: 10,
      maxTiltDegrees: 56,
      minFocusX: -200,
      maxFocusX: 2500,
      minFocusY: 300,
      maxFocusY: 1950,
    },
  },
  // Right to left: from the east of the city toward Hewlêr.
  route: [
    bend(2160, 1110),
    stop(1900, 1120),
    bend(1760, 1000),
    stop(1640, 1010),
    bend(1530, 1150),
    stop(1440, 1185),
    bend(1330, 1250),
    bend(1180, 1255),
    stop(1000, 1185),
    bend(860, 1060),
    bend(740, 905),
    stop(600, 862),
    bend(440, 862),
    bend(270, 880),
    bend(110, 862),
  ],
  landmarks: [
    {
      id: 'grand-mosque',
      x: 1236,
      y: 1120,
      width: 300,
      image: require('@/assets/journey/silemani/grand-mosque.png'),
      site: { width: 480, height: 340 },
    },
    {
      id: 'grand-millennium',
      x: 410,
      y: 696,
      width: 122,
      image: require('@/assets/journey/silemani/grand-millennium.png'),
      site: { width: 230, height: 180 },
    },
  ],
};
