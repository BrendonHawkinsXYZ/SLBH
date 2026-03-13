import type {
  FieldState,
  FieldHistoryResponse,
  ColorData,
  EmotionData,
  DeltaStreamResponse,
  ChromaPageData,
  HSLColor,
} from "./chroma-types";

const BASE_URL = process.env.NEXT_PUBLIC_CHROMA_API_URL ?? "";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchAllChromaData(): Promise<ChromaPageData | null> {
  try {
    // Step 1: Get current state + history in parallel
    const [current, historyRes, deltaRes] = await Promise.all([
      fetchJSON<FieldState>("/field/american-emotions/current"),
      fetchJSON<FieldHistoryResponse>("/field/american-emotions/history?limit=7"),
      fetchJSON<DeltaStreamResponse>("/delta/stream?field_context_id=american-emotions&limit=1"),
    ]);

    // Step 2: Fetch emotions for current state
    const emotions = await fetchJSON<EmotionData>(
      `/interpretability/emotions/${current.id}?parent_type=field_state`
    );

    // Step 3: Fetch colors for current + history states
    // History results are newest-first from API, we need oldest-first for the orb
    const historyStates = historyRes.results;

    // Collect all unique state IDs to fetch colors for (current + history)
    const allStates = [current, ...historyStates];
    const uniqueIds = [...new Set(allStates.map((s) => s.id))];

    const colorMap = new Map<string, ColorData>();
    const colorResults = await Promise.all(
      uniqueIds.map(async (id) => {
        const colors = await fetchJSON<ColorData[]>(
          `/interpretability/color/${id}?parent_type=field_state`
        );
        return { id, color: colors[0] };
      })
    );
    for (const { id, color } of colorResults) {
      if (color) colorMap.set(id, color);
    }

    const currentColor = colorMap.get(current.id);
    if (!currentColor) throw new Error("No color for current state");

    // Build color history: history is newest-first, reverse to oldest-first
    // Then take up to 7 entries
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
      emotions,
      delta,
      currentColor,
      colorHistory,
    };
  } catch (err) {
    console.error("Chroma API error:", err);
    return null;
  }
}
