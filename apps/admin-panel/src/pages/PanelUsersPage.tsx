import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, RotateCcw } from "lucide-react";

const userStats = [
  { label: "Total Users", value: "342", icon: Users, color: "bg-info/10 text-info" },
  { label: "Active (30d)", value: "198", icon: UserCheck, color: "bg-success/10 text-success" },
  { label: "Inactive", value: "144", icon: UserX, color: "bg-muted text-muted-foreground" },
  { label: "Avg. Reorders", value: "2.4", icon: RotateCcw, color: "bg-accent/10 text-accent" },
];

const topUsers = [
  { id: "u1", name: "Rajesh Kumar", phone: "+91 98765 43210", orders: 28, profiles: 3, lastOrder: "Mar 5, 2026" },
  { id: "u2", name: "Sneha Iyer", phone: "+91 87654 32109", orders: 22, profiles: 1, lastOrder: "Mar 7, 2026" },
  { id: "u3", name: "Mohammed Ali", phone: "+91 88776 65544", orders: 19, profiles: 2, lastOrder: "Mar 8, 2026" },
  { id: "u4", name: "Lakshmi Devi", phone: "+91 77665 54433", orders: 15, profiles: 1, lastOrder: "Mar 8, 2026" },
  { id: "u5", name: "Arun Prasad", phone: "+91 66554 43322", orders: 12, profiles: 2, lastOrder: "Feb 20, 2026" },
];

const PanelUsersPage = () => {
  const navigate = useNavigate();

  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">User Analytics</h1>
        <p className="text-sm text-muted-foreground">Customer usage and activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <h3 className="font-bold text-foreground mb-3">Top Customers</h3>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Phone</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Orders</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Profiles</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user) => (
              <tr key={user.id} onClick={() => navigate(`/panel/users/${user.id}`)} className="border-b border-border last:border-0 hover:bg-secondary/20 cursor-pointer transition-colors">
                <td className="p-4 font-semibold text-foreground">{user.name}</td>
                <td className="p-4 text-muted-foreground">{user.phone}</td>
                <td className="p-4 text-foreground font-semibold">{user.orders}</td>
                <td className="p-4 text-muted-foreground">{user.profiles}</td>
                <td className="p-4 text-muted-foreground">{user.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelUsersPage;
