import { Home, Navigation, Package, ClipboardList, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Queue", path: "/delivery" },
  { icon: Package, label: "My Jobs", path: "/delivery/my-deliveries" },
  { icon: Navigation, label: "Routes", path: "/delivery/routes" },
  { icon: User, label: "Profile", path: "/delivery/profile" },
];

const DeliveryBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/delivery/login") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <nav className="bg-card/95 backdrop-blur-xl border-t border-border/60 px-2 pt-2 pb-safe flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="delivery-nav-indicator"
                    className="absolute -top-2 w-8 h-1 bg-info rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  size={22}
                  className={isActive ? "text-info" : "text-muted-foreground"}
                />
                <span className={`text-[10px] font-medium ${isActive ? "text-info" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DeliveryBottomNav;
