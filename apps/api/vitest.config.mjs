import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/platform/testing/load-test-env.ts'],
  },
});
