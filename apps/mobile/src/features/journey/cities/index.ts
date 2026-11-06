import { silemani } from './silemani/silemani';

export const cities = { silemani } as const;

export type CityId = keyof typeof cities;
