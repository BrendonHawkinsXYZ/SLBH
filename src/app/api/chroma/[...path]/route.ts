const API_BASE = process.env.CHROMA_API_URL || "https://chroma-vesa.onrender.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const apiPath = path.join("/");
  const url = new URL(request.url);
  const queryString = url.search;

  const res = await fetch(`${API_BASE}/${apiPath}${queryString}`, {
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
