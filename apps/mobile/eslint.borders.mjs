/**
 * Import borders (plan section 4): a feature is only used through its front door
 * (`@/features/<name>`), and layers point down: screens → features → ui / platform.
 */

const featureInsides = {
  group: ['@/features/*/**'],
  message: "Use the feature's front door: import from '@/features/<name>' only.",
};

const screens = {
  group: ['@/app/**'],
  message: 'Screens are never imported; they only put features together.',
};

const features = {
  group: ['@/features/**'],
  message: 'ui and platform sit below features and may not use them.',
};

/** A relative import may not climb out of its own feature (use the other feature's front door). */
const leavingTheFeature = (levels) => ({
  regex: `^(\\.\\./){${levels}}`,
  message: "Don't climb out of the feature: use '@/features/<name>' for other features.",
});

const restrict = (...patterns) => ({ 'no-restricted-imports': ['error', { patterns }] });

export const importBorders = [
  { files: ['src/**/*.{ts,tsx}'], rules: restrict(featureInsides, screens) },
  {
    files: ['src/{ui,platform}/**/*.{ts,tsx}'],
    rules: restrict(featureInsides, screens, features),
  },
  {
    files: ['src/features/*/*.{ts,tsx}'],
    rules: restrict(featureInsides, screens, leavingTheFeature(1)),
  },
  {
    files: ['src/features/*/*/*.{ts,tsx}'],
    rules: restrict(featureInsides, screens, leavingTheFeature(2)),
  },
  {
    files: ['src/features/*/*/*/*.{ts,tsx}'],
    rules: restrict(featureInsides, screens, leavingTheFeature(3)),
  },
  {
    files: ['src/features/*/*/*/*/*.{ts,tsx}'],
    rules: restrict(featureInsides, screens, leavingTheFeature(4)),
  },
];
