"use client";

import { useState } from "react";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useChatStream } from "@/hooks/use-chat-stream";

export function ChatInput() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const { stream } = useChatStream();

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);

    try {
      await stream({
        question,
      });

      setQuestion("");
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t bg-background p-4 shrink-0">
      <div className="relative flex-1">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="
          min-h-15
          pr-16
          resize-none
          rounded-2xl"
        />

        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          className="
          absolute
          bottom-3
          right-3
          h-9
          w-9
          rounded-lg"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
