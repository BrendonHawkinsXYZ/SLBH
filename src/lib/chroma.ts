import type {
  FieldState,
  FieldHistoryResponse,
  ColorData,
  EmotionData,
  DeltaStreamResponse,
  ChromaPageData,
  MappedEmotionData,
  HSLColor,
} from "./chroma-types";

// Client: route through /api/chroma proxy (URL stays hidden from browser)
// Server: call the external API directly — CHROMA_API_URL is a non-NEXT_PUBLIC_ var
//         so Next.js strips it from client bundles; it never reaches the browser
const API_BASE =
  typeof window === "undefined"
    ? process.env.CHROMA_API_URL || "https://chroma-vesa.onrender.com"
    : "/api/chroma";
const FIELD_ID = "us_collective";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchAllChromaData(): Promise<ChromaPageData | null> {
  try {
    // Hop 1: history + delta + current all in parallel
    const [historyRes, deltaRes, currentOrNull] = await Promise.all([
      fetchJSON<FieldHistoryResponse>(`/field/${FIELD_ID}/history?limit=7`),
      fetchJSON<DeltaStreamResponse>(`/delta/stream?field_context_id=${FIELD_ID}&limit=1`),
      fetchJSON<FieldState>(`/field/${FIELD_ID}/current`).catch(() => null),
    ]);

    const current: FieldState | null = currentOrNull ?? historyRes.results[0] ?? null;
    if (!current) return null;

    const historyStates = historyRes.results;
    const allStates = [current, ...historyStates];
    const uniqueIds = [...new Set(allStates.map((s) => s.id))];

    // Hop 2: emotions + all colors in parallel (both only need current.id / allStates)
    const [rawEmotions, colorResults] = await Promise.all([
      fetchJSON<EmotionData>(`/interpretability/emotions/${current.id}?parent_type=field_state`),
      Promise.all(
        uniqueIds.map(async (id) => {
          const colors = await fetchJSON<ColorData[]>(
            `/interpretability/color/${id}?parent_type=field_state`,
          );
          return { id, color: colors[0] };
        }),
      ),
    ]);

    const mappedEmotions: MappedEmotionData = {
      ...rawEmotions,
      top_emotions: rawEmotions.top_emotions.map((e) => ({
        ...e,
        label: e.emotion_id.replace(/_/g, " "),
        score: e.weight,
      })),
    };

    const colorMap = new Map<string, ColorData>();
    for (const { id, color } of colorResults) {
      if (color) colorMap.set(id, color);
    }

    const currentColor = colorMap.get(current.id);
    if (!currentColor) throw new Error("No color for current state");

    // Build color history: history is newest-first, reverse to oldest-first
    const reversedHistory = [...historyStates].reverse();
    const colorHistory: HSLColor[] = reversedHistory
      .map((state) => {
        const c = colorMap.get(state.id);
        return c ? { hsl_h: c.hsl_h, hsl_s: c.hsl_s, hsl_l: c.hsl_l } : null;
      })
      .filter((c): c is HSLColor => c !== null);

    const delta = deltaRes.results[0];
    if (!delta) throw new Error("No delta data");

    return {
      fieldState: current,
      emotions: mappedEmotions,
      delta,
      currentColor,
      colorHistory,
    };
  } catch (err) {
    console.error("Chroma API error:", err);
    return null;
  }
}
