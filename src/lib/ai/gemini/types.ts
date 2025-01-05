export interface ChatMessage {
  role: "user" | "model";
  parts: string[];
}

export interface ChatResponse {
  response: string;
  error?: string;
}

export interface AIConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}
