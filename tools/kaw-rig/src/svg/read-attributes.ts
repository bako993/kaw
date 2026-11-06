const ATTRIBUTE_PATTERN = /([\w:-]+)="([^"]*)"/g;

export function readAttributes(tag: string): ReadonlyMap<string, string> {
  const attributes = new Map<string, string>();
  for (const [, name = '', value = ''] of tag.matchAll(ATTRIBUTE_PATTERN)) {
    attributes.set(name, value);
  }
  return attributes;
}

export function requireAttribute(attributes: ReadonlyMap<string, string>, name: string): string {
  const value = attributes.get(name);
  if (value === undefined) {
    throw new Error(`Missing attribute "${name}"`);
  }
  return value;
}
