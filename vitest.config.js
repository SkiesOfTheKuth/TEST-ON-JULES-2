import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      lines: 80,
      functions: 80,
      statements: 80,
      branches: 70
    }
  }
});
