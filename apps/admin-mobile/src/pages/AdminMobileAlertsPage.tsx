import { motion } from "framer-motion";
import { Bell, AlertTriangle, Upload, Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { formatOrderCode, useAdminOrders } from "@/hooks/useAdminOrders";

const typeColors = {
  info: "bg-info/10 text-info",
  error: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const AdminMobileAlertsPage = () => {
  const navigate = useNavigate();
  const { orders } = useAdminOrders();

  const alerts = orders.slice(0, 5).map((order) => {
    if (order.status === "ordered") {
      return {
        icon: Upload,
        title: "New Order",
        desc: `${order.account?.name || order.profile.name} placed ${formatOrderCode(order._id)}`,
        time: new Date(order.createdAt).toLocaleString(),
        type: "info" as const,
        link: `/admin-mobile/orders/${order._id}`,
      };
    }

    if (order.status === "out_for_delivery") {
      return {
        icon: AlertTriangle,
        title: "Delivery In Progress",
        desc: `${formatOrderCode(order._id)} is on the way`,
        time: new Date(order.updatedAt).toLocaleString(),
        type: "error" as const,
        link: `/admin-mobile/orders/${order._id}`,
      };
    }

    return {
      icon: Package,
      title: "Order Updated",
      desc: `${formatOrderCode(order._id)} is ${order.status.replaceAll("_", " ")}`,
      time: new Date(order.updatedAt).toLocaleString(),
      type: "success" as const,
      link: `/admin-mobile/orders/${order._id}`,
    };
  });

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Notifications</h1>
        <p className="text-sm text-muted-foreground mb-6">{alerts.length} new alerts</p>

        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(alert.link)}
              className="glass-card p-4 flex items-start gap-3 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${typeColors[alert.type]} flex items-center justify-center shrink-0`}>
                <alert.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
            </motion.div>
          ))}
          {alerts.length === 0 && (
            <div className="glass-card p-4 text-sm text-muted-foreground">
              No order alerts right now.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileAlertsPage;
