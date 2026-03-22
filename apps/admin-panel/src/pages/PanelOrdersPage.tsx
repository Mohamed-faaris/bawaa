import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@bawaa/ui/dialog";
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

const PanelOrdersPage = () => {
  console.log("[PanelOrdersPage] Component rendered");

  const orders = useQuery(api.admin.listOrders);
  const updateOrderStatus = useMutation(api.admin.updateOrderStatus);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const isOrderDialogOpen = selectedOrderId !== null;

  const orderData = orders || [];
  const selectedOrder =
    orderData.find((o: any) => o._id === selectedOrderId) || null;

  console.log(
    "[PanelOrdersPage] State - selectedOrderId:",
    selectedOrderId,
    "selectedOrder:",
    selectedOrder?._id,
  );

  useEffect(() => {
    console.log("[PanelOrdersPage] selectedOrderId effect:", selectedOrderId);
  }, [selectedOrderId]);

  useEffect(() => {
    console.log(
      "[PanelOrdersPage] Data fetch:",
      orders === undefined ? "loading..." : `${orderData.length} orders`,
    );
  }, [orders]);

  const filtered = orderData.filter((o: any) => {
    const matchFilter = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      (o.account?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleStatusChange = async (
    orderId: Id<"orders">,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      toast.success("Order status updated");
      setShowStatusMenu(false);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleViewClick = (orderId: string) => {
    console.log("[PanelOrdersPage] handleViewClick - orderId:", orderId);
    setSelectedOrderId(orderId);
    console.log(
      "[PanelOrdersPage] After setSelectedOrderId - state:",
      selectedOrderId,
    );
  };

  console.log(
    "[PanelOrdersPage] RENDERING DIALOG SECTION - open:",
    !!selectedOrder,
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orderData.length} total orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              "all",
              "ordered",
              "processing",
              "ready",
              "out_for_delivery",
              "delivered",
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg capitalize transition-colors ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order: any) => (
          <div
            key={order._id}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-bold text-foreground">
                    ORD-{order._id.slice(-4).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.account?.name || "Unknown"} •{" "}
                    {order.profile?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-secondary text-muted-foreground"}`}
                >
                  {order.status.replace("_", " ")}
                </span>
                <button
                  onClick={() => handleViewClick(order._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80"
                >
                  View
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(order.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No orders found
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog
        open={isOrderDialogOpen}
        onOpenChange={(open) => {
          console.log("[PanelOrdersPage] Dialog onOpenChange:", open);
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View and manage order status</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">
                    ORD-{selectedOrder._id.slice(-4).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.account?.name || "Unknown"}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[selectedOrder.status] || ""}`}
                  >
                    {selectedOrder.status.replace("_", " ")}{" "}
                    <ChevronDown size={12} className="inline ml-1" />
                  </button>
                  {showStatusMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      {(
                        [
                          "ordered",
                          "processing",
                          "ready",
                          "out_for_delivery",
                          "delivered",
                        ] as OrderStatus[]
                      ).map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            handleStatusChange(selectedOrder._id, s)
                          }
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary"
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Profile: {selectedOrder.profile?.name || "N/A"}
                </p>
                {selectedOrder.prescription?.notes && (
                  <p className="text-sm text-muted-foreground">
                    Notes: {selectedOrder.prescription.notes}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PanelOrdersPage;
