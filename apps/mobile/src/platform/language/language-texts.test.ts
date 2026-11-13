import { describe, expect, it } from 'vitest';

import { formatNumber, formatText, placeholdersOf } from './format-text';
import { APP_LANGUAGES, DEFAULT_LANGUAGE, isAppLanguage } from './languages';
import { TEXTS } from './texts';

interface TextTree {
  readonly [key: string]: string | TextTree;
}

function flatten(tree: TextTree, prefix = ''): Map<string, string> {
  const lines = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') lines.set(path, value);
    else for (const [child, text] of flatten(value, path)) lines.set(child, text);
  }
  return lines;
}

const master = flatten(TEXTS[DEFAULT_LANGUAGE]);

describe('app texts', () => {
  it.each(APP_LANGUAGES)('%s has every line of the master list, none empty', (language) => {
    const lines = flatten(TEXTS[language]);
    expect([...lines.keys()].sort()).toEqual([...master.keys()].sort());
    for (const [path, text] of lines) expect(text.trim(), path).not.toBe('');
  });

  it.each(APP_LANGUAGES)('%s uses the same {marks} as the master list', (language) => {
    const lines = flatten(TEXTS[language]);
    for (const [path, masterText] of master) {
      const marks = placeholdersOf(lines.get(path) ?? '').sort();
      expect(marks, path).toEqual(placeholdersOf(masterText).sort());
    }
  });
});

describe('formatText', () => {
  it('fills marks and keeps unknown ones visible', () => {
    expect(formatText('Step {current} of {total}', { current: 3, total: 8 }, 'en')).toBe(
      'Step 3 of 8',
    );
    expect(formatText('Stars: {count}', {}, 'en')).toBe('Stars: {count}');
  });

  it('writes numbers in Kurdish digits for Kurdish', () => {
    expect(formatText('{current}/{total}', { current: 3, total: 10 }, 'ckb')).toBe('٣/١٠');
    expect(formatNumber(1205, 'ckb')).toBe('١٢٠٥');
    expect(formatNumber(1205, 'nl')).toBe('1205');
  });
});

describe('saved language check', () => {
  it('accepts only real app languages', () => {
    expect(isAppLanguage('nl')).toBe(true);
    expect(isAppLanguage('fr')).toBe(false);
    expect(isAppLanguage(null)).toBe(false);
  });
});
