/**
 * Canonical site origin, without a trailing slash. Used by the sitemap and
 * robots routes to build absolute URLs. Override per environment with
 * NEXT_PUBLIC_SITE_URL; otherwise defaults to the production domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://studiolabbh.xyz";
