// @ts-check
const { withGradleProperties } = require('expo/config-plugins');

/**
 * Android builds only: lets Gradle work on 1 part at a time.
 * Compiling six native (C++) parts at once ran Expo's build machine out of memory
 * ("Gradle build daemon disappeared"). Fewer at a time is slower, but fits in memory.
 */
const GRADLE_PROPERTIES = {
  'org.gradle.workers.max': '1',
};

/** @type {import('expo/config-plugins').ConfigPlugin} */
const withAndroidBuildLimits = (config) =>
  withGradleProperties(config, (gradle) => {
    for (const [key, value] of Object.entries(GRADLE_PROPERTIES)) {
      gradle.modResults = gradle.modResults.filter(
        (item) => !(item.type === 'property' && item.key === key),
      );
      gradle.modResults.push({ type: 'property', key, value });
    }
    return gradle;
  });

module.exports = withAndroidBuildLimits;
