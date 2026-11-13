import type { AppLanguage } from '../languages';
import { ckb } from './ckb';
import { en } from './en';
import { nl } from './nl';
import type { Texts } from './text-tree';

export type { Texts } from './text-tree';

/** Every app language's texts. Typecheck fails if a language in `APP_LANGUAGES` has none. */
export const TEXTS: Readonly<Record<AppLanguage, Texts>> = { ckb, nl, en };
