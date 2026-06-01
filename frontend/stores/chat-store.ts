import { create } from "zustand";

export interface SourceDoc {
  content: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceDoc[];
}

interface ChatStore {
  messages: ChatMessage[];

  addMessage: (message: ChatMessage) => void;

  updateMessage: (id: string, content: string) => void;

  setSources: (id: string, sources: SourceDoc[]) => void;

  clear: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg,
      ),
    })),

  setSources: (id, sources) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, sources } : msg,
      ),
    })),

  clear: () => set({ messages: [] }),
}));
