"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, SESSION_COOKIE } from "./auth";

export async function unlockDemo(_: { error: string }, data: FormData) {
  const password = data.get("password");
  const session = typeof password === "string" ? createSession(password) : null;
  if (!session) return { error: "That password didn’t match. Please try again." };
  const requestHeaders = await headers();
  (await cookies()).set(SESSION_COOKIE, session, { httpOnly: true, secure: requestHeaders.get("x-forwarded-proto") === "https" || process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 8 * 60 * 60, path: "/private/wellthy" });
  redirect("/private/wellthy");
}
export async function lockDemo() {
  (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/private/wellthy" });
  redirect("/private/wellthy");
}
