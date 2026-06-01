import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { CitationList } from "./citation-list";

interface Props {
  message: ChatMessage;
}

export function Message({ message }: Props) {
  return (
    <div
      className={cn(
        "flex mb-6",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-3xl rounded-2xl px-4 py-3",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "border bg-background",
        )}
      >
        {message.role === "assistant" ? (
          <>
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </article>

            {message.sources && message.sources.length > 0 && (
              <CitationList sources={message.sources} />
            )}
          </>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
