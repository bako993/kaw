export type Declarations = ReadonlyMap<string, string>;

export function readDeclarations(block: string): Declarations {
  const declarations = new Map<string, string>();

  for (const declaration of block.split(';')) {
    const separator = declaration.indexOf(':');
    if (separator > 0) {
      declarations.set(
        declaration.slice(0, separator).trim(),
        declaration.slice(separator + 1).trim(),
      );
    }
  }

  return declarations;
}

export function readClassRules(css: string): ReadonlyMap<string, Declarations> {
  const rules = new Map<string, Declarations>();
  const withoutKeyframes = css.replace(/@(keyframes|media)[^{]*\{(?:[^{}]*\{[^}]*\})*\s*\}/g, '');

  for (const [, selector = '', block = ''] of withoutKeyframes.matchAll(
    /(\.[\w.-]+)\s*\{([^}]*)\}/g,
  )) {
    rules.set(selector, readDeclarations(block));
  }

  return rules;
}

export function declarationsForClasses(
  rules: ReadonlyMap<string, Declarations>,
  className: string,
): Declarations {
  const classes = new Set(className.split(/\s+/).filter(Boolean));
  const merged = new Map<string, string>();

  for (const [selector, declarations] of rules) {
    const needed = selector.split('.').filter(Boolean);
    if (needed.every((name) => classes.has(name))) {
      for (const [property, value] of declarations) {
        merged.set(property, value);
      }
    }
  }

  return merged;
}
