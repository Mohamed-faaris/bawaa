import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { formatOrderCode, useAdminOrders } from "@/hooks/useAdminOrders";

const AdminMobileDashboardPage = () => {
  const navigate = useNavigate();
  const { orders } = useAdminOrders();

  const stats = [
    {
      label: "New Orders",
      value: orders.filter((order) => order.status === "ordered").length,
      icon: ShoppingBag,
      color: "bg-info/10 text-info",
    },
    {
      label: "Pending Review",
      value: orders.filter((order) => order.status === "ordered").length,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Processing",
      value: orders.filter((order) => order.status === "processing").length,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Ready",
      value: orders.filter((order) => order.status === "ready").length,
      icon: Truck,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "delivered").length,
      icon: CheckCircle2,
      color: "bg-success/10 text-success",
    },
    {
      label: "Active Delivery",
      value: orders.filter((order) => order.status === "out_for_delivery").length,
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
    },
  ];

  const recentOrders = [...orders].slice(0, 3);

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Live overview from Convex
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate("/admin-mobile/orders")}
              className="glass-card p-4 text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Recent Activity */}
        <h3 className="font-bold text-foreground mb-3">Recent Orders</h3>
        <div className="space-y-2">
          {recentOrders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card p-3 flex items-start gap-3"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                order.status === "delivered"
                  ? "bg-success"
                  : order.status === "out_for_delivery"
                    ? "bg-destructive"
                    : "bg-info"
              }`} />
              <div>
                <p className="text-sm text-foreground">
                  {formatOrderCode(order._id)} for {order.account?.name || order.profile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.status.replaceAll("_", " ")} ·{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
          {recentOrders.length === 0 && (
            <div className="glass-card p-4 text-sm text-muted-foreground">
              No orders available yet.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileDashboardPage;
