/** A file shipped inside the app (picture, sound, sticker). Metro hands it over as a number. */
export type BundledAsset = number;

/**
 * Gives `require('@/assets/…')` a real type instead of `any`, and checks it on the way.
 * Usage: `bundledAsset(require('@/assets/audio/word/hello.m4a'))`.
 */
export function bundledAsset(file: unknown): BundledAsset {
  if (typeof file !== 'number') {
    throw new Error(`Expected a file bundled by require(), got ${typeof file}`);
  }
  return file;
}
