import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export function DocumentStatusBadge({ status }: Props) {
  switch (status) {
    case "completed":
      return <Badge>Completed</Badge>;

    case "failed":
      return <Badge variant="destructive">Failed</Badge>;

    case "active":
      return <Badge variant="secondary">Processing</Badge>;

    default:
      return <Badge variant="outline">Queued</Badge>;
  }
}
