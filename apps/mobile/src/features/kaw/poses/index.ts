import { cheering } from './cheering.generated';

export const poses = { cheering } as const;

export type PoseName = keyof typeof poses;
