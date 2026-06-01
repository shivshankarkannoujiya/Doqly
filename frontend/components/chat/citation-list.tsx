"use client";

import type { SourceDoc } from "@/types/chat";

interface Props {
  sources: SourceDoc[];
}

export function CitationList({ sources }: Props) {
  if (!sources.length) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sources.map((source, index) => {
        const page =
          source.metadata?.loc?.pageNumber ??
          source.metadata?.pageNumber ??
          source.metadata?.page ??
          "Unknown";

        return (
          <button
            key={index}
            className="
              rounded-lg
              border
              px-3
              py-1
              text-xs
              hover:bg-muted
              transition-colors
            "
          >
            Source {index + 1}
            {" • "}
            Page {String(page)}
          </button>
        );
      })}
    </div>
  );
}
