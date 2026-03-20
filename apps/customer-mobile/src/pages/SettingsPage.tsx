import { motion } from "framer-motion";
import { User, MapPin, Phone, ChevronRight, LogOut, Users, Bell, HelpCircle, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const menuItems = [
  { icon: User, label: "Account Details", subtitle: "+91 9876543210", path: "#" },
  { icon: MapPin, label: "Delivery Address", subtitle: "123, MG Road, Chennai", path: "#" },
  { icon: Users, label: "Manage Profiles", subtitle: "3 profiles", path: "/profiles" },
  { icon: Bell, label: "Notifications", subtitle: "Enabled", path: "#" },
  { icon: HelpCircle, label: "Help & Support", subtitle: "FAQs, contact us", path: "#" },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8 mt-2"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">RK</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">Rajesh Kumar</h2>
            <p className="text-sm text-muted-foreground">Personal Account</p>
          </div>
        </motion.div>

        {/* Menu Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card overflow-hidden divide-y divide-border mb-6"
        >
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-destructive/20 text-destructive font-semibold text-sm hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={18} /> Log Out
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;
