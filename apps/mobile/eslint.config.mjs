import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

import { typescriptConfig } from '../../eslint.base.mjs';

import { importBorders } from './eslint.borders.mjs';

export default defineConfig([
  { ignores: ['dist/*', '.expo/*'] },
  expoConfig,
  typescriptConfig(import.meta.dirname),
  {
    rules: {
      // Worklet rule 1: a helper must be defined above the code that uses it.
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: true, classes: true, variables: false },
      ],
    },
  },
  {
    // Expo config plugins are plain Node files.
    files: ['plugins/**/*.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  importBorders,
]);
