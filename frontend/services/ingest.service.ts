import { http } from "./http";

export interface IngestStatusResponse {
  jobId: string;
  status: "waiting" | "active" | "completed" | "failed" | "delayed";

  progress: number;
  filename: string;
  error?: string;
}

export async function getIngestStatus(
  jobId: string,
): Promise<IngestStatusResponse> {
  const { data } = await http.get(`/ingest/${jobId}`);

  return data;
}
