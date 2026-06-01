"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadPdf } from "@/services/upload.service";
import { useDocumentStore } from "@/stores/document-store";

export function UploadDropzone() {
  const addDocument = useDocumentStore((s) => s.addDocument);

  const onDrop = useCallback(
    async (files: File[]) => {
      try {
        const file = files[0];

        if (!file) return;

        const response = await uploadPdf(file);

        addDocument({
          jobId: response.jobId,
          filename: file.name,
          fileUrl: response.fileUrl,
          progress: 0,
          status: "waiting",
        });

        toast.success("PDF uploaded");
      } catch (error) {
        toast.error("Upload failed");
      }
    },
    [addDocument],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        rounded-xl
        border
        border-dashed
        p-8
        cursor-pointer
        transition
        
        ${isDragActive ? "border-primary" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div
        className="
        flex
        flex-col
        items-center
        gap-3
      "
      >
        <UploadCloud />

        <div className="text-center">
          <p className="font-medium">Upload PDF</p>

          <p
            className="
            text-xs
            text-muted-foreground
          "
          >
            Drag & Drop
          </p>
        </div>
      </div>
    </div>
  );
}
