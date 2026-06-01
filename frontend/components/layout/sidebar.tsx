import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { Separator } from "@/components/ui/separator";
import { DocumentList } from "@/components/upload/document-list";

export function Sidebar() {
  return (
    <aside
      className="
      w-80
      shrink-0
      border-r
      border-border
      bg-muted/20
      flex
      flex-col
    "
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Doqly</h1>

        <p className="text-sm text-muted-foreground">Chat with PDFs</p>
      </div>

      <Separator />

      <div className="p-4">
        <UploadDropzone />
      </div>

      <Separator />

      <div className="flex-1 overflow-auto p-4">
        <h3 className="mb-4 text-sm font-medium">Documents</h3>

        <DocumentList />
      </div>
    </aside>
  );
}
