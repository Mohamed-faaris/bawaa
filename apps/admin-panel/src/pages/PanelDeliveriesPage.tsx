import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const deliveryStatusStyles: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-warning/15 text-warning",
  ready: "bg-info/15 text-info",
  out_for_delivery: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
};

const PanelDeliveriesPage = () => {
  const orders = useQuery(api.admin.listOrders);
  const orderData = orders || [];

  useEffect(() => {
    console.log("[PanelDeliveriesPage] Data fetch status:", {
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${orderData.length} orders`,
    });
  }, [orders, orderData.length]);

  const activeDeliveries = orderData.filter(
    (o: any) => o.status === "out_for_delivery" || o.status === "ready",
  );

  const deliveredToday = orderData.filter((o: any) => {
    const today = new Date().toDateString();
    return (
      new Date(o.updatedAt).toDateString() === today && o.status === "delivered"
    );
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Deliveries</h1>
        <p className="text-sm text-muted-foreground">Track active deliveries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center mb-3">
            <Truck size={20} className="text-info" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {activeDeliveries.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active Deliveries
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-3">
            <Truck size={20} className="text-success" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {deliveredToday.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Delivered Today
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Truck size={20} className="text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {orderData.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Orders</p>
        </motion.div>
      </div>

      <h3 className="font-bold text-foreground mb-3">Active Deliveries</h3>
      <div className="space-y-3">
        {activeDeliveries.map((order: any) => (
          <div
            key={order._id}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">
                  ORD-{order._id.slice(-4).toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.account?.name} • {order.profile?.name}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deliveryStatusStyles[order.status] || ""}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
        {activeDeliveries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No active deliveries
          </div>
        )}
      </div>
    </>
  );
};

export default PanelDeliveriesPage;
