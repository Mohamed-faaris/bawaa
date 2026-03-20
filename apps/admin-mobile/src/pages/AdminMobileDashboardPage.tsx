import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Truck, AlertTriangle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const stats = [
  { label: "New Orders", value: 8, icon: ShoppingBag, color: "bg-info/10 text-info" },
  { label: "Pending Review", value: 3, icon: Clock, color: "bg-warning/10 text-warning" },
  { label: "Processing", value: 5, icon: Package, color: "bg-primary/10 text-primary" },
  { label: "Ready", value: 4, icon: Truck, color: "bg-accent/10 text-accent" },
  { label: "Delivered", value: 42, icon: CheckCircle2, color: "bg-success/10 text-success" },
  { label: "Issues", value: 1, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
];

const AdminMobileDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Today's overview</p>

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
        <h3 className="font-bold text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {[
            { text: "New prescription uploaded by Rajesh Kumar", time: "2 min ago", type: "info" },
            { text: "ORD-2048 marked as processing", time: "15 min ago", type: "success" },
            { text: "Delivery failed for ORD-2040", time: "1 hr ago", type: "error" },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card p-3 flex items-start gap-3"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                activity.type === "info" ? "bg-info" : activity.type === "success" ? "bg-success" : "bg-destructive"
              }`} />
              <div>
                <p className="text-sm text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileDashboardPage;
