import { cn } from "@/lib/utils";

type Status = "pending" | "processing" | "ready" | "delivered" | "cancelled";
type LiveStatus =
  | "ordered"
  | "processing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  processing: { label: "Processing", className: "bg-info/15 text-info" },
  ready: { label: "Ready", className: "bg-primary/15 text-primary" },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
};

const liveStatusConfig: Record<LiveStatus, { label: string; className: string }> = {
  ordered: { label: "Ordered", className: "bg-warning/15 text-warning" },
  processing: { label: "Processing", className: "bg-info/15 text-info" },
  ready: { label: "Ready", className: "bg-primary/15 text-primary" },
  out_for_delivery: {
    label: "Out for delivery",
    className: "bg-accent/15 text-accent",
  },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
};

const StatusBadge = ({ status }: { status: Status | LiveStatus }) => {
  const config =
    status in liveStatusConfig
      ? liveStatusConfig[status as LiveStatus]
      : statusConfig[status as Status];
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
