import type { ckb } from './ckb';

/** The same shape as the master list, with any text allowed in place of the Kurdish. */
type TextTree<T> = { readonly [K in keyof T]: T[K] extends string ? string : TextTree<T[K]> };

export type Texts = TextTree<typeof ckb>;
