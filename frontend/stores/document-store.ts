import { create } from "zustand";
import { DocumentItem } from "@/types/document";

interface DocumentStore {
  documents: DocumentItem[];
  addDocument: (document: DocumentItem) => void;
  updateDocument: (jobId: string, data: Partial<DocumentItem>) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents],
    })),

  updateDocument: (jobId, data) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.jobId === jobId ? { ...doc, ...data } : doc,
      ),
    })),
}));
