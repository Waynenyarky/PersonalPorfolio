import { describe, it, expect } from 'vitest';
import { t } from './translations';

describe('t (translations)', () => {
  it('returns English string when language is en', () => {
    expect(t('en', 'nav.home')).toBe('Home');
    expect(t('en', 'hero.role')).toBe('Full Stack Developer');
  });

  it.skip('returns Filipino string when language is fil', () => {
    expect(t('fil', 'nav.home')).toBe('Home');
    expect(t('fil', 'hero.role')).toBe('Full Stack Developer');
  });

  it('returns key when key is missing', () => {
    expect(t('en', 'missing.key')).toBe('missing.key');
  });
});
