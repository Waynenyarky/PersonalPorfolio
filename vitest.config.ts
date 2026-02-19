import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    '__vite_ssr_exportName__': '(function(_,v){return v})',
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'src/services/bookingService.test.ts',
      'src/i18n/translations.test.ts',
    ],
  },
});
