import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Truck, Shield, Monitor } from "lucide-react";

const apps = [
  { icon: Smartphone, label: "Customer App", desc: "Upload prescriptions, manage profiles, track orders", path: "/login", color: "bg-primary/10 text-primary" },
  { icon: Truck, label: "Delivery App", desc: "Accept deliveries, update status, view routes", path: "/delivery/login", color: "bg-info/10 text-info" },
  { icon: Shield, label: "Admin Mobile", desc: "Quick order monitoring and status updates", path: "/admin-mobile/login", color: "bg-accent/10 text-accent" },
  { icon: Monitor, label: "Admin Panel", desc: "Full dashboard with analytics and reports", path: "/panel", color: "bg-success/10 text-success" },
];

const AppSwitcher = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-foreground text-2xl font-extrabold">B</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Bavaa Medicals</h1>
        <p className="text-muted-foreground mt-1">Select an application to continue</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
        {apps.map((app, i) => (
          <motion.button
            key={app.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(app.path)}
            className="bg-card rounded-2xl border border-border p-6 text-left hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center mb-3`}>
              <app.icon size={22} />
            </div>
            <p className="font-bold text-foreground">{app.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{app.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AppSwitcher;
