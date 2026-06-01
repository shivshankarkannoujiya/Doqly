export interface SourceDoc {
  id: string;
  pageNumber?: number;
  content: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  sources?: SourceDoc[];
}
