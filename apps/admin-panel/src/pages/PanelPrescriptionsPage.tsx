import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Phone,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

type OrderStatus =
  | "ordered"
  | "processing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

const statusColors: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-info/15 text-info",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
};

const PanelPrescriptionsPage = () => {
  const orders = useQuery(api.admin.listOrders);
  const updateOrderStatus = useMutation(api.admin.updateOrderStatus);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const orderData = orders || [];

  useEffect(() => {
    console.log("[PanelPrescriptionsPage] Data fetch status:", {
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${orderData.length} orders`,
    });
  }, [orders, orderData.length]);

  const prescriptionOrders = orderData.filter(
    (o: any) => o.prescription?.storageId || o.prescription?.imageUrl,
  );

  const handleStatusChange = async (
    orderId: Id<"orders">,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Prescriptions
        </h1>
        <p className="text-sm text-muted-foreground">
          {prescriptionOrders.length} prescriptions uploaded
        </p>
      </div>

      <div className="space-y-3">
        {prescriptionOrders.map((order: any) => (
          <div
            key={order._id}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    ORD-{order._id.slice(-4).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.account?.name} • {order.profile?.name}
                  </p>
                  {order.prescription?.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Notes: {order.prescription.notes}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || ""}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
              <div className="flex gap-2">
                {(
                  [
                    "ordered",
                    "processing",
                    "ready",
                    "delivered",
                  ] as OrderStatus[]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(order._id, s)}
                    className="text-xs font-semibold px-2 py-1 rounded bg-secondary hover:bg-secondary/80"
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        {prescriptionOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No prescriptions uploaded yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PanelPrescriptionsPage;
