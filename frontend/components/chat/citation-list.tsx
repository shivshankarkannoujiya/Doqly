"use client";

import { useState } from "react";
import type { SourceDoc } from "@/types/chat";
import { CitationModal } from "../citations/citation-modal";

interface Props {
  sources: SourceDoc[];
}

export function CitationList({ sources }: Props) {
  const [selectedSource, setSelectedSource] = useState<SourceDoc | null>(null);

  const [open, setOpen] = useState(false);

  const handleOpen = (source: SourceDoc) => {
    setSelectedSource(source);
    setOpen(true);
  };

  if (!sources.length) {
    return null;
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {sources.map((source, index) => {
          const page = source.metadata?.loc?.pageNumber ?? "Unknown";

          return (
            <button
              key={index}
              onClick={() => handleOpen(source)}
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                transition-colors
                hover:bg-muted
              "
            >
              📄 Page {page}
            </button>
          );
        })}
      </div>

      <CitationModal
        source={selectedSource}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
