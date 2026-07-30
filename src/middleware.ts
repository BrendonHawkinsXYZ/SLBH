import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, UNLOCK_PATH, accessToken } from "@/lib/gate";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get(GATE_COOKIE)?.value;
  if (cookie && cookie === (await accessToken())) return NextResponse.next();

  // Rewrite rather than redirect, so the address bar keeps the real path.
  const url = req.nextUrl.clone();
  url.pathname = UNLOCK_PATH;
  url.search = "";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/product/chroma", "/product/chroma/:path*"],
};
