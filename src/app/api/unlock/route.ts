import { NextResponse, type NextRequest } from "next/server";
import {
  GATE_COOKIE,
  UNLOCK_PATH,
  accessToken,
  isPassword,
  safeNext,
} from "@/lib/gate";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));

  if (!isPassword(password)) {
    const url = new URL(UNLOCK_PATH, req.url);
    url.searchParams.set("next", next);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set({
    name: GATE_COOKIE,
    value: await accessToken(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
