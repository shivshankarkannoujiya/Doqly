import { create } from "zustand";

import type { ChatMessage, SourceDoc } from "@/types/chat";

interface ChatStore {
  messages: ChatMessage[];

  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setSources: (id: string, sources: SourceDoc[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              content,
            }
          : message,
      ),
    })),

  setSources: (id, sources) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              sources,
            }
          : message,
      ),
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));
