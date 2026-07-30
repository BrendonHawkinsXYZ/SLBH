/**
 * Soft gate for pages that are live but not ready to be seen. Not a security
 * boundary — it keeps a page out of casual view while it is being worked on.
 *
 * Set CHROMA_PASSWORD in the host environment to override the default, which
 * keeps the working password out of the repository.
 */

export const GATE_COOKIE = "slbh_gate";
export const GATED_PATH = "/product/chroma";
export const UNLOCK_PATH = "/unlock";

const PASSWORD = process.env.CHROMA_PASSWORD ?? "Chroma1994";

/** Cookie value: a digest of the password, so the cookie never carries it. */
export async function accessToken(): Promise<string> {
  const bytes = new TextEncoder().encode(`slbh-gate:${PASSWORD}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isPassword(input: string): boolean {
  return input === PASSWORD;
}

/** Keeps redirects on this site — anything else falls back to the gated page. */
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return GATED_PATH;
  return raw;
}
