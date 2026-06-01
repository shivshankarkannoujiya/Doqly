export interface SourceDoc {
  pageContent: string;
  score?: number;

  metadata?: {
    source?: string;

    loc?: {
      pageNumber?: number;

      lines?: {
        from: number;
        to: number;
      };
    };

    chunkIndex?: number;
    totalChunks?: number;
    fileUrl?: string;
    [key: string]: unknown;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  sources?: SourceDoc[];
}
