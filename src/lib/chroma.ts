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

const API_BASE = "/api/chroma";
const FIELD_ID = "us_collective";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchAllChromaData(): Promise<ChromaPageData | null> {
  try {
    // Step 1: Get history + delta in parallel (always available)
    const [historyRes, deltaRes] = await Promise.all([
      fetchJSON<FieldHistoryResponse>(`/field/${FIELD_ID}/history?limit=7`),
      fetchJSON<DeltaStreamResponse>(`/delta/stream?field_context_id=${FIELD_ID}&limit=1`),
    ]);

    // Step 2: Get current state — fall back to history[0] if /current 404s
    let current: FieldState;
    try {
      current = await fetchJSON<FieldState>(`/field/${FIELD_ID}/current`);
    } catch {
      if (historyRes.results.length === 0) return null;
      current = historyRes.results[0];
    }

    // Step 3: Fetch emotions for current state and map field names
    const rawEmotions = await fetchJSON<EmotionData>(
      `/interpretability/emotions/${current.id}?parent_type=field_state`,
    );

    const mappedEmotions: MappedEmotionData = {
      ...rawEmotions,
      top_emotions: rawEmotions.top_emotions.map((e) => ({
        ...e,
        label: e.emotion_id.replace(/_/g, " "),
        score: e.weight,
      })),
    };

    // Step 4: Fetch colors for current + history states
    const historyStates = historyRes.results;
    const allStates = [current, ...historyStates];
    const uniqueIds = [...new Set(allStates.map((s) => s.id))];

    const colorMap = new Map<string, ColorData>();
    const colorResults = await Promise.all(
      uniqueIds.map(async (id) => {
        const colors = await fetchJSON<ColorData[]>(
          `/interpretability/color/${id}?parent_type=field_state`,
        );
        return { id, color: colors[0] };
      }),
    );
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
