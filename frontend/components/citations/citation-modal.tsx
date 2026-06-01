"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import type { SourceDoc } from "@/types/chat";

interface CitationModalProps {
  source: SourceDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CitationModal({
  source,
  open,
  onOpenChange,
}: CitationModalProps) {
  if (!source) return null;

  const page = source.metadata?.loc?.pageNumber ?? "Unknown";
  const filename = source.metadata?.source ?? "Document";

  const similarity =
    source.score != null ? `${Math.round(source.score * 100)}%` : "N/A";

  const chunkIndex = source.metadata?.chunkIndex;
  const totalChunks = source.metadata?.totalChunks;

  const preview =
    source.pageContent.length > 2000
      ? source.pageContent.slice(0, 2000) + "..."
      : source.pageContent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📄 {filename}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Page {page}</Badge>

          <Badge variant="secondary">Match {similarity}</Badge>

          {chunkIndex !== undefined && totalChunks !== undefined && (
            <Badge variant="secondary">
              Chunk {chunkIndex + 1} / {totalChunks}
            </Badge>
          )}
        </div>

        <ScrollArea className="h-112.5 mt-4 rounded-lg border">
          <div className="p-5">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Retrieved Context
            </h4>

            <pre
              className="
                whitespace-pre-wrap
                wrap-break-word
                font-sans
                text-sm
                leading-7
              "
            >
              {preview}
            </pre>
          </div>
        </ScrollArea>

        {source.metadata?.fileUrl && (
          <div className="flex justify-end">
            <Button asChild>
              <a
                href={source.metadata.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open PDF
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
