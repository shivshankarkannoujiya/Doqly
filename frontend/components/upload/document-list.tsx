"use client";

import { useDocumentStore } from "@/stores/document-store";
import { DocumentCard } from "./document-card";

export function DocumentList() {
  const documents = useDocumentStore((state) => state.documents);

  if (!documents.length) {
    return (
      <p className="text-sm text-muted-foreground">No documents uploaded</p>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentCard key={document.jobId} document={document} />
      ))}
    </div>
  );
}
