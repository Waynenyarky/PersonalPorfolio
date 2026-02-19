/**
 * Contact email from environment. Set VITE_CONTACT_EMAIL in .env.
 * Single source of truth for contact email across the app.
 */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? '';
