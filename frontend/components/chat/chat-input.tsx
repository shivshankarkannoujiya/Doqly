"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput() {
  return (
    <div
      className="
      border-t
      border-border
      p-4
    "
    >
      <div
        className="
        max-w-4xl
        mx-auto
        flex
        gap-3
      "
      >
        <Textarea placeholder="Ask a question..." className="min-h-14" />

        <Button size="icon">
          <Send />
        </Button>
      </div>
    </div>
  );
}
