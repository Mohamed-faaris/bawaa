import { cn } from "@/lib/utils";

type Status =
  | "pending"
  | "processing"
  | "ready"
  | "delivered"
  | "cancelled"
  | "ordered"
  | "out_for_delivery";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  ordered: { label: "New", className: "bg-warning/15 text-warning" },
  processing: { label: "Processing", className: "bg-info/15 text-info" },
  ready: { label: "Ready", className: "bg-primary/15 text-primary" },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-info/15 text-info",
  },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as Status] || {
    label: status,
    className: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "text-xs font-semibold px-2.5 py-1 rounded-full",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
