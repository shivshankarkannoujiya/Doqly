"use client";

import { useEffect, useRef } from "react";

import { useChatStore } from "@/stores/chat-store";

import { Message } from "./message";

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
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Chat with your PDFs</h1>

          <p className="mt-3 text-muted-foreground">
            Upload a document and start asking questions
          </p>
        </div>
      </div>
    );
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
