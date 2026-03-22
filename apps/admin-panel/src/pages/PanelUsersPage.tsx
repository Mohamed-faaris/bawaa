import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, RotateCcw } from "lucide-react";

const PanelUsersPage = () => {
  const navigate = useNavigate();
  const accounts = useQuery(api.admin.listAccounts);
  const profiles = useQuery(api.admin.listProfiles);
  const orders = useQuery(api.admin.listOrders);

  const accountData = accounts || [];
  const profileData = profiles || [];
  const orderData = orders || [];

  useEffect(() => {
    console.log("[PanelUsersPage] Data fetch status:", {
      accounts:
        accounts === undefined
          ? "loading..."
          : `loaded ${accountData.length} accounts`,
      profiles:
        profiles === undefined
          ? "loading..."
          : `loaded ${profileData.length} profiles`,
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${orderData.length} orders`,
    });
  }, [accounts, profiles, orders]);

  const totalUsers = accountData.length;
  const activeUsers = accountData.filter((a: any) => {
    const userOrders = orderData.filter((o: any) => o.account?._id === a._id);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return userOrders.some((o: any) => o.createdAt > thirtyDaysAgo);
  }).length;
  const inactiveUsers = totalUsers - activeUsers;

  const userStats = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      color: "bg-info/10 text-info",
    },
    {
      label: "Active (30d)",
      value: activeUsers.toString(),
      icon: UserCheck,
      color: "bg-success/10 text-success",
    },
    {
      label: "Inactive",
      value: inactiveUsers.toString(),
      icon: UserX,
      color: "bg-muted text-muted-foreground",
    },
    {
      label: "Avg. Reorders",
      value:
        orderData.length > 0
          ? (orderData.length / totalUsers || 0).toFixed(1)
          : "0",
      icon: RotateCcw,
      color: "bg-accent/10 text-accent",
    },
  ];

  const topUsers = accountData.slice(0, 5).map((account: any) => {
    const userProfiles = profileData.filter(
      (p: any) => p.accountId === account._id,
    );
    const userOrders = orderData.filter(
      (o: any) => o.account?._id === account._id,
    );
    const lastOrder = userOrders.sort(
      (a: any, b: any) => b.createdAt - a.createdAt,
    )[0];
    return {
      id: account._id,
      name: account.name,
      phone: account.phone,
      orders: userOrders.length,
      profiles: userProfiles.length,
      lastOrder: lastOrder
        ? new Date(lastOrder.createdAt).toLocaleDateString()
        : "N/A",
    };
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          User Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Customer usage and activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <h3 className="font-bold text-foreground mb-3">Top Customers</h3>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Phone
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Orders
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Profiles
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Last Order
              </th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => navigate(`/panel/users/${user.id}`)}
                className="border-b border-border last:border-0 hover:bg-secondary/20 cursor-pointer transition-colors"
              >
                <td className="p-4 font-semibold text-foreground">
                  {user.name}
                </td>
                <td className="p-4 text-muted-foreground">{user.phone}</td>
                <td className="p-4 text-foreground">{user.orders}</td>
                <td className="p-4 text-foreground">{user.profiles}</td>
                <td className="p-4 text-muted-foreground">{user.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PanelUsersPage;
