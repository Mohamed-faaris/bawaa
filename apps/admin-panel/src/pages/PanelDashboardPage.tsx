import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const statusColors: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-info/15 text-info",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
};

const PanelDashboardPage = () => {
  console.log("[PanelDashboardPage] Component rendered");
  const orders = useQuery(api.admin.listOrders);
  const accounts = useQuery(api.admin.listAccounts);
  const profiles = useQuery(api.admin.listProfiles);

  const orderData = orders || [];

  useEffect(() => {
    console.log("[PanelDashboardPage] Data fetch status:", {
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${orderData.length} orders`,
      accounts:
        accounts === undefined
          ? "loading..."
          : `loaded ${(accounts || []).length} accounts`,
      profiles:
        profiles === undefined
          ? "loading..."
          : `loaded ${(profiles || []).length} profiles`,
    });
  }, [orders, accounts, profiles]);

  const totalOrders = orderData.length;
  const pendingOrders = orderData.filter((o) => o.status === "ordered").length;
  const processingOrders = orderData.filter(
    (o) => o.status === "processing",
  ).length;
  const deliveredToday = orderData.filter((o) => {
    const today = new Date().toDateString();
    return (
      new Date(o.createdAt).toDateString() === today && o.status === "delivered"
    );
  }).length;

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
    const dayOrders = orderData.filter(
      (o) => new Date(o.createdAt).toDateString() === day.toDateString(),
    ).length;
    return { day: dayName, orders: dayOrders };
  });

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: "+12%",
      up: true,
      icon: ShoppingBag,
      color: "bg-info/10 text-info",
    },
    {
      label: "Pending",
      value: pendingOrders.toString(),
      change: "+3",
      up: true,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Processing",
      value: processingOrders.toString(),
      change: "-2",
      up: false,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Delivered Today",
      value: deliveredToday.toString(),
      change: "+18%",
      up: true,
      icon: CheckCircle2,
      color: "bg-success/10 text-success",
    },
  ];

  const recentOrders = orderData.slice(0, 5);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here's today's overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={20} />
              </div>
              <span
                className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-success" : "text-destructive"}`}
              >
                {stat.up ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip />
              <Bar
                dataKey="orders"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  Profile
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-semibold text-foreground">
                    ORD-{order._id.slice(-4).toUpperCase()}
                  </td>
                  <td className="p-4 text-foreground">
                    {order.account?.name || "Unknown"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {order.profile?.name || "Unknown"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-secondary text-muted-foreground"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PanelDashboardPage;
