import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupRequest = {
  email?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  let body: SignupRequest;

  try {
    body = (await request.json()) as SignupRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Quietly accept honeypot submissions so bots do not learn the filter.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const webhookUrl = process.env.CHROMA_SIGNUP_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Launch-note signup is not connected yet." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "chroma-landing",
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      redirect: "follow",
    });

    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!response.ok || result?.ok !== true) {
      throw new Error(`Webhook rejected the signup (${response.status})`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chroma signup webhook failed", error);
    return NextResponse.json(
      { error: "We couldn’t save that email. Please try again." },
      { status: 502 },
    );
  }
}
