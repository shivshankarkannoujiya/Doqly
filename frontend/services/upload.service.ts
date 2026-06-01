import { http } from "./http";

export interface UploadResponse {
  message: string;
  jobId: string;
  fileUrl: string;
}

export async function uploadPdf(file: File): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await http.post("/ingest", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
