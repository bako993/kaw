// @ts-check
const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Android only: sideways either way round. Expo's `"orientation": "landscape"` locks Android
 * to one side; "sensorLandscape" lets the screen turn when the child turns the phone around
 * (iPhones already allow both sides).
 */
/** @type {import('expo/config-plugins').ConfigPlugin} */
const withAndroidSideways = (config) =>
  withAndroidManifest(config, (manifest) => {
    for (const application of manifest.modResults.manifest.application ?? []) {
      for (const activity of application.activity ?? []) {
        if (activity.$['android:name'] === '.MainActivity') {
          activity.$['android:screenOrientation'] = 'sensorLandscape';
        }
      }
    }
    return manifest;
  });

module.exports = withAndroidSideways;
