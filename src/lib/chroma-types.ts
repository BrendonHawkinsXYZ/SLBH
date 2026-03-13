export interface FieldState {
  id: string;
  field_context_id: string;
  timestamp: string;
  affective_centroid: number[];
  volatility_score: number;
  coherence_score: number;
  trends_in_window: number;
  prev_state_id: string | null;
  embed_model_version: string;
  projection_version: string;
  created_at: string;
}

export interface FieldHistoryResponse {
  total_count: number;
  limit: number;
  offset: number;
  results: FieldState[];
}

export interface ColorData {
  id: string;
  parent_id: string;
  parent_type: string;
  hex: string;
  hsl_h: number;
  hsl_s: number;
  hsl_l: number;
  sentiment: string | null;
  intensity_level: number | null;
  chroma_mapping_version: string;
  projection_version: string;
  created_at: string;
}

export interface EmotionEntry {
  label: string;
  score: number;
}

export interface EmotionData {
  id: string;
  parent_id: string;
  parent_type: string;
  top_emotions: EmotionEntry[];
  display_distribution: EmotionEntry[] | null;
  taxonomy_version: string;
  derived_model_version: string;
  projection_version: string;
  method: string;
  confidence: number;
  created_at: string;
}

export interface DeltaData {
  id: string;
  field_context_id: string;
  t_start: string;
  t_end: string;
  state_from_id: string;
  state_to_id: string;
  delta_vector: number[];
  delta_magnitude: number;
  delta_direction: number[];
  confidence: number;
  embed_model_version: string;
  projection_version: string;
  created_at: string;
}

export interface DeltaStreamResponse {
  total_count: number;
  limit: number;
  offset: number;
  results: DeltaData[];
}

export interface HSLColor {
  hsl_h: number;
  hsl_s: number;
  hsl_l: number;
}

export interface ChromaPageData {
  fieldState: FieldState;
  emotions: EmotionData;
  delta: DeltaData;
  currentColor: ColorData;
  colorHistory: HSLColor[];
}
