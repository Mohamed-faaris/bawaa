import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(152, 60%, 42%)",
  "hsl(205, 80%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 55%)",
];

const PanelAnalyticsPage = () => {
  const orders = useQuery(api.admin.listOrders);
  const orderData = orders || [];

  useEffect(() => {
    console.log("[PanelAnalyticsPage] Data fetch status:", {
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${orderData.length} orders`,
    });
  }, [orders, orderData.length]);

  const monthlyOrders: Record<string, number> = {};
  orderData.forEach((o: any) => {
    const month = new Date(o.createdAt).toLocaleDateString("en-US", {
      month: "short",
    });
    monthlyOrders[month] = (monthlyOrders[month] || 0) + 1;
  });

  const orderVolumeData = Object.entries(monthlyOrders).map(
    ([month, orders]) => ({ month, orders }),
  );

  const statusCounts = {
    delivered: orderData.filter((o: any) => o.status === "delivered").length,
    processing: orderData.filter(
      (o: any) =>
        o.status === "processing" ||
        o.status === "ready" ||
        o.status === "out_for_delivery",
    ).length,
    pending: orderData.filter((o: any) => o.status === "ordered").length,
  };

  const statusBreakdown = [
    { name: "Delivered", value: statusCounts.delivered, color: COLORS[0] },
    { name: "Processing", value: statusCounts.processing, color: COLORS[1] },
    { name: "Pending", value: statusCounts.pending, color: COLORS[2] },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Analytics & Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Business metrics and performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">
            Monthly Order Volume
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderVolumeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
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
          <h3 className="font-bold text-foreground mb-4">
            Order Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {statusBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-extrabold text-foreground">
              {orderData.length}
            </p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-extrabold text-foreground">
              {statusCounts.delivered}
            </p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-extrabold text-foreground">
              {statusCounts.processing}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-extrabold text-foreground">
              {statusCounts.pending}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelAnalyticsPage;
