import "server-only";
import { createHash, createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "slbh_wellthy_session";
const salt = "slbh-wellthy-demo-v1";
// Hash of the derived bearer token. Neither the password nor a usable session
// token is shipped to the browser or stored in source.
const defaultTokenHash = "f38c94c75a917e45123543dcfd800c7b585f49fe97c1c928aa12493f862c771d";
function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function equal(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function expectedHash() { return process.env.WELLTHY_DEMO_PASSWORD ? hash(scryptSync(process.env.WELLTHY_DEMO_PASSWORD, salt, 32).toString("hex")) : defaultTokenHash; }
export function createSession(password: string) {
  if (password.length > 128) return null;
  const token = scryptSync(password, salt, 32).toString("hex");
  if (!equal(hash(token), expectedHash())) return null;
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  const signature = createHmac("sha256", token).update(expires).digest("hex");
  return `${token}.${expires}.${signature}`;
}
export async function isAuthenticated() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value || value.length > 200) return false;
  const [token, expires, signature, extra] = value.split(".");
  if (extra || !token || !expires || !signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now() || Number(expires) > Date.now() + 8 * 60 * 60 * 1000) return false;
  return equal(hash(token), expectedHash()) && equal(signature, createHmac("sha256", token).update(expires).digest("hex"));
}
