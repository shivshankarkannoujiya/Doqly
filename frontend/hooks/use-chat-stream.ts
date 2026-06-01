"use client";

import { askQuestion } from "@/services/chat.service";
import { useChatStore } from "@/stores/chat-store";

interface AskOptions {
  question: string;
  topK?: number;
}

export function useChatStream() {
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const setSources = useChatStore((state) => state.setSources);

  const stream = async ({ question, topK = 5 }: AskOptions) => {
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    addMessage({
      id: userId,
      role: "user",
      content: question,
      createdAt: Date.now(),
    });

    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    });

    const response = await askQuestion(question, topK);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    let accumulated = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split("\n\n");

      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.trim();

        if (!line.startsWith("data:")) {
          continue;
        }

        try {
          const payload = JSON.parse(line.replace(/^data:\s*/, ""));

          switch (payload.type) {
            case "retrieval_start":
              break;

            case "retrieval_done":
              break;

            case "token":
              accumulated += payload.token;

              updateMessage(assistantId, accumulated);
              break;

            case "done":
              if (payload.docs) {
                setSources(assistantId, payload.docs);
              }

              return;

            case "error":
              throw new Error(payload.message ?? "Stream failed");

            default:
              console.log("Unknown SSE event:", payload);
          }
        } catch (error) {
          console.error("Failed to parse SSE payload:", error);
        }
      }
    }
  };

  return {
    stream,
  };
}
