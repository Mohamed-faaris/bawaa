import { motion } from "framer-motion";
import { Bell, AlertTriangle, Upload, Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const alerts = [
  { icon: Upload, title: "New Prescription", desc: "Lakshmi Devi uploaded a new prescription", time: "Just now", type: "info" as const, link: "/admin-mobile/orders/ORD-2053" },
  { icon: Upload, title: "New Prescription", desc: "Mohammed Ali uploaded a new prescription", time: "2 min ago", type: "info" as const, link: "/admin-mobile/orders/ORD-2051" },
  { icon: AlertTriangle, title: "Delivery Issue", desc: "ORD-2040 delivery failed — customer unreachable", time: "1 hr ago", type: "error" as const, link: "/admin-mobile/orders" },
  { icon: Package, title: "Order Processed", desc: "ORD-2048 has been processed and packed", time: "2 hrs ago", type: "success" as const, link: "/admin-mobile/orders/ORD-2048" },
  { icon: Upload, title: "New Prescription", desc: "Sneha Iyer uploaded a prescription", time: "3 hrs ago", type: "info" as const, link: "/admin-mobile/orders/ORD-2050" },
];

const typeColors = {
  info: "bg-info/10 text-info",
  error: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const AdminMobileAlertsPage = () => {
  const navigate = useNavigate();

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
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileAlertsPage;
