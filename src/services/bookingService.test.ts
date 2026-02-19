import { describe, it, expect, vi, beforeEach } from 'vitest';
// Note: Import may fail under rolldown-vite transform. Use npm run test to run utils/example.test.ts.
import { submitBooking } from './bookingService';

describe('submitBooking', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('returns error when required fields are missing', async () => {
    const result = await submitBooking({
      name: '',
      email: 'test@example.com',
      phone: '09123456789',
      projectType: 'web-app',
      projectDescription: 'Test',
      timeline: '1-month',
      preferredContact: 'email',
    });
    expect(result.type).toBe('error');
    expect(result.message).toContain('required');
  });

  it('returns success when API responds ok', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ email_sent: true }),
    } as Response);

    const result = await submitBooking({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '09123456789',
      projectType: 'web-app',
      projectDescription: 'A web app',
      timeline: '1-month',
      preferredContact: 'email',
    });

    expect(result.type).toBe('success');
    expect(result.message).toBeDefined();
  });

  it('returns error when API responds with non-ok status', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Validation error' }),
    } as Response);

    const result = await submitBooking({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '09123456789',
      projectType: 'web-app',
      projectDescription: 'A web app',
      timeline: '1-month',
      preferredContact: 'email',
    });

    expect(result.type).toBe('error');
    expect(result.message).toContain('Validation error');
  });

  it('returns serverError when fetch fails (network error)', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const result = await submitBooking({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '09123456789',
      projectType: 'web-app',
      projectDescription: 'A web app',
      timeline: '1-month',
      preferredContact: 'email',
    });

    expect(result.type).toBe('error');
    expect((result as { serverError?: boolean }).serverError).toBe(true);
  });
});
