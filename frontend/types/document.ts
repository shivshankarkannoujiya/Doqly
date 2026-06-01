export type IngestionStatus =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed";

export interface DocumentItem {
  jobId: string;
  filename: string;
  fileUrl: string;
  status: IngestionStatus;
  progress: number;
}
