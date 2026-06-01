"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Message } from "./message";
import { EmptyState } from "./empty-state";

export function MessageList() {
  const messages = useChatStore((state) => state.messages);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  if (!messages.length) {
    return <EmptyState />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
