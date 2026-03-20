import { motion } from "framer-motion";
import { User, Phone, Truck, LogOut, Star, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const stats = [
  { label: "Today", value: "5", icon: Package },
  { label: "This Week", value: "28", icon: Truck },
  { label: "Rating", value: "4.8", icon: Star },
];

const DeliveryProfilePage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-4 mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center">
            <Truck size={28} className="text-info" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">Suresh Babu</h2>
            <p className="text-sm text-muted-foreground">Staff ID: DEL-045</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone size={12} /> +91 99887 76655
            </p>
          </div>
        </motion.div>

        <h3 className="font-bold text-foreground mb-3">Delivery Stats</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 text-center"
            >
              <stat.icon size={20} className="text-info mx-auto mb-2" />
              <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/delivery/login")}
          className="w-full flex items-center justify-center gap-2 py-3 text-destructive font-semibold text-sm"
        >
          <LogOut size={18} /> Logout
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default DeliveryProfilePage;
