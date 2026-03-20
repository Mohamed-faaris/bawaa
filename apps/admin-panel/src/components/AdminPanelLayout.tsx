import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, FileText, Truck, Users, BarChart3,
  Settings, ChevronLeft, ChevronRight, LogOut, Pill
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/panel" },
  { icon: ClipboardList, label: "Orders", path: "/panel/orders" },
  { icon: FileText, label: "Prescriptions", path: "/panel/prescriptions" },
  { icon: Truck, label: "Deliveries", path: "/panel/deliveries" },
  { icon: Users, label: "Users", path: "/panel/users" },
  { icon: BarChart3, label: "Analytics", path: "/panel/analytics" },
  { icon: Settings, label: "Settings", path: "/panel/settings" },
];

const AdminPanelLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-60"} bg-card border-r border-border flex flex-col transition-all duration-200 shrink-0`}>
        <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "gap-3"} border-b border-border`}>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Pill className="text-primary-foreground" size={18} />
          </div>
          {!collapsed && <span className="font-extrabold text-foreground text-sm">Bavaa Admin</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary"
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut size={18} />
            {!collapsed && <span>Exit Panel</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminPanelLayout;
