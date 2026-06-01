"use client";

import { useEffect } from "react";

import { getIngestStatus } from "@/services/ingest.service";
import { useDocumentStore } from "@/stores/document-store";

const POLLING_INTERVAL = 2000;

export function useIngestPolling(jobId: string, currentStatus?: string) {
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  useEffect(() => {
    if (!jobId) return;

    if (currentStatus === "completed" || currentStatus === "failed") {
      return;
    }

    let mounted = true;

    const poll = async () => {
      try {
        const response = await getIngestStatus(jobId);

        if (!mounted) return;

        updateDocument(jobId, {
          status: response.status,
          progress:
            typeof response.progress === "number" ? response.progress : 0,
        });

        if (response.status === "completed" || response.status === "failed") {
          window.clearInterval(intervalId);
        }
      } catch (error) {
        console.error(`[Polling Error] ${jobId}`, error);
      }
    };

    poll();

    const intervalId = window.setInterval(poll, POLLING_INTERVAL);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [jobId, currentStatus, updateDocument]);
}
