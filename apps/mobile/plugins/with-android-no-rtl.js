// @ts-check
const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Android only: never mirror the layout, even on phones set to Arabic or Kurdish.
 * Kaw keeps one fixed layout in every language (decided 13 Nov). React Native only
 * mirrors when the app says `android:supportsRtl="true"`, so we say "false".
 * iPhones need nothing: they only mirror apps that ship a right-to-left translation.
 */
/** @type {import('expo/config-plugins').ConfigPlugin} */
const withAndroidNoRtl = (config) =>
  withAndroidManifest(config, (manifest) => {
    for (const application of manifest.modResults.manifest.application ?? []) {
      application.$['android:supportsRtl'] = 'false';
    }
    return manifest;
  });

module.exports = withAndroidNoRtl;
