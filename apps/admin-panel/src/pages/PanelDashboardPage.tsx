import { motion } from "framer-motion";
import {
  ShoppingBag, Clock, Package, Truck, CheckCircle2, AlertTriangle,
  TrendingUp, Users, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const stats = [
  { label: "Total Orders", value: "1,248", change: "+12%", up: true, icon: ShoppingBag, color: "bg-info/10 text-info" },
  { label: "Pending", value: "11", change: "+3", up: true, icon: Clock, color: "bg-warning/10 text-warning" },
  { label: "Processing", value: "8", change: "-2", up: false, icon: Package, color: "bg-primary/10 text-primary" },
  { label: "Delivered Today", value: "42", change: "+18%", up: true, icon: CheckCircle2, color: "bg-success/10 text-success" },
];

const weeklyData = [
  { day: "Mon", orders: 35 }, { day: "Tue", orders: 42 }, { day: "Wed", orders: 38 },
  { day: "Thu", orders: 55 }, { day: "Fri", orders: 48 }, { day: "Sat", orders: 62 }, { day: "Sun", orders: 30 },
];

const monthlyData = [
  { month: "Sep", revenue: 45000 }, { month: "Oct", revenue: 52000 }, { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 61000 }, { month: "Jan", revenue: 55000 }, { month: "Feb", revenue: 67000 }, { month: "Mar", revenue: 72000 },
];

const recentOrders = [
  { id: "ORD-2053", customer: "Lakshmi Devi", items: 1, total: "₹180", status: "Pending", statusColor: "bg-warning/15 text-warning" },
  { id: "ORD-2051", customer: "Mohammed Ali", items: 4, total: "₹920", status: "Pending", statusColor: "bg-warning/15 text-warning" },
  { id: "ORD-2050", customer: "Sneha Iyer", items: 2, total: "₹340", status: "Processing", statusColor: "bg-info/15 text-info" },
  { id: "ORD-2048", customer: "Rajesh Kumar", items: 3, total: "₹485", status: "Processing", statusColor: "bg-info/15 text-info" },
  { id: "ORD-2041", customer: "Priya Kumar", items: 5, total: "₹1,230", status: "Ready", statusColor: "bg-primary/15 text-primary" },
];

const PanelDashboardPage = () => {
  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's today's overview.</p>
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
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-success" : "text-destructive"}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
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
                <th className="text-left p-4 font-semibold text-muted-foreground">Order ID</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Items</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{order.id}</td>
                  <td className="p-4 text-foreground">{order.customer}</td>
                  <td className="p-4 text-muted-foreground">{order.items}</td>
                  <td className="p-4 text-foreground">{order.total}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelDashboardPage;
