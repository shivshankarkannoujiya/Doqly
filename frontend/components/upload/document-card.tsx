"use client";

import { Progress } from "@/components/ui/progress";
import { useIngestPolling } from "@/hooks/use-ingest-polling";
import { DocumentStatusBadge } from "./document-status-badge";
import type { DocumentItem } from "@/types/document";

interface Props {
  document: DocumentItem;
}

export function DocumentCard({ document }: Props) {
  useIngestPolling(document.jobId, document.status);

  return (
    <div className="rounded-xl border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium">{document.filename}</p>

        <DocumentStatusBadge status={document.status} />
      </div>

      <Progress value={document.progress} />

      <p className="text-xs text-muted-foreground">{document.progress}%</p>
    </div>
  );
}
