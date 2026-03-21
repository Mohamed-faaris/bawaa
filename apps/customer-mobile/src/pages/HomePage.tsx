import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  ClipboardList,
  Clock,
  Bell,
  ChevronRight,
  Pill,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

const quickActions = [
  {
    icon: Upload,
    label: "Upload\nPrescription",
    path: "/upload",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ClipboardList,
    label: "My\nOrders",
    path: "/orders",
    color: "bg-info/10 text-info",
  },
  {
    icon: Clock,
    label: "Reorder\nMedicine",
    path: "/history",
    color: "bg-accent/10 text-accent",
  },
];

const statusColors: Record<string, string> = {
  processing: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  ordered: "bg-warning/15 text-warning",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-info/15 text-info",
};

const HomePage = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState<Id<"accounts"> | null>(null);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    if (storedAccountId) {
      setAccountId(storedAccountId as Id<"accounts">);
    }
  }, []);

  const orders = useQuery(api.orders.listByAccount, {
    accountId: accountId ?? null,
  });

  const account = useQuery(api.auth.getAccount, {
    accountId: accountId ?? null,
  });

  const userName = account?.name || "User";

  const recentOrders = orders?.slice(0, 3) || [];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()}</p>
            <h1 className="text-xl font-extrabold text-foreground">
              {userName}
            </h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center relative">
            <Bell size={20} className="text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-background" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-2xl p-5 mb-6 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-primary-foreground font-bold text-lg">
              Upload Prescription
            </h2>
            <p className="text-primary-foreground/80 text-sm mt-1 max-w-[200px]">
              Get your medicines delivered in under 2 hours
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-3 bg-primary-foreground text-primary font-semibold text-sm px-4 py-2 rounded-xl"
            >
              Upload Now
            </button>
          </div>
          <div className="absolute right-3 bottom-3 opacity-10">
            <Pill size={100} strokeWidth={1} />
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => navigate(action.path)}
              className="glass-card p-4 flex flex-col items-center gap-2.5"
            >
              <div
                className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center`}
              >
                <action.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-foreground text-center whitespace-pre-line leading-tight">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Recent Orders</h3>
            <button
              onClick={() => navigate("/orders")}
              className="text-sm text-primary font-semibold"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map(
                (
                  order: {
                    _id: Id<"orders">;
                    status: string;
                    createdAt: number;
                  },
                  i: number,
                ) => (
                  <motion.button
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => navigate("/orders")}
                    className="glass-card p-4 w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <ClipboardList
                          size={18}
                          className="text-secondary-foreground"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground text-sm">
                          ORD-{order._id.slice(-4).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || ""}`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                  </motion.button>
                ),
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No orders yet</p>
                <button
                  onClick={() => navigate("/upload")}
                  className="text-primary text-sm font-semibold mt-2"
                >
                  Upload a prescription to get started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
