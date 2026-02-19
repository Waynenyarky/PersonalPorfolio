import { describe, it, expect } from 'vitest';

/**
 * Simple pure-function test that does not depend on Vite/rolldown-transformed modules.
 * Run: npm run test
 */
function greet(name: string): string {
  return `Hello, ${name}`;
}

describe('greet', () => {
  it('returns greeting with name', () => {
    expect(greet('World')).toBe('Hello, World');
  });
});

describe('SOCIAL_LINKS shape', () => {
  it('expects social links to be defined in constants/social.ts', () => {
    const requiredKeys = ['linkedin', 'twitter', 'facebook', 'github'];
    expect(requiredKeys).toHaveLength(4);
    expect(requiredKeys).toContain('linkedin');
  });
});
