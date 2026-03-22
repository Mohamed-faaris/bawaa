import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useEffect } from "react";

const statusStyles: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-info/15 text-info",
  ready: "bg-primary/15 text-primary",
  delivered: "bg-success/15 text-success",
  out_for_delivery: "bg-info/15 text-info",
};

const PanelUserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const accounts = useQuery(api.admin.listAccounts);
  const profiles = useQuery(api.admin.listProfiles);
  const orders = useQuery(api.admin.listOrders);

  useEffect(() => {
    console.log("[PanelUserDetailPage] Data fetch status:", {
      accounts:
        accounts === undefined
          ? "loading..."
          : `loaded ${(accounts || []).length} accounts`,
      profiles:
        profiles === undefined
          ? "loading..."
          : `loaded ${(profiles || []).length} profiles`,
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${(orders || []).length} orders`,
    });
  }, [accounts, profiles, orders]);

  const account = accounts?.find((a) => a._id === userId);
  const accountProfiles = (profiles || []).filter(
    (p) => p.accountId === userId,
  );
  const accountOrders = (orders || []).filter((o) => o.account?._id === userId);

  if (
    accounts === undefined ||
    profiles === undefined ||
    orders === undefined
  ) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">User not found</p>
        <button
          onClick={() => navigate("/panel/users")}
          className="text-primary text-sm mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  const totalSpent = accountOrders.reduce((sum, _o) => sum + 0, 0);
  const avgOrderValue =
    accountOrders.length > 0 ? totalSpent / accountOrders.length : 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/panel/users")}
          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-foreground">
            {account.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Customer since{" "}
            {new Date(account.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <a
          href={`tel:${account.phone}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          <Phone size={15} /> Call Customer
        </a>
      </div>

      {/* Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contact card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            Contact Info
          </p>
          <div className="space-y-2.5">
            <p className="text-sm text-foreground flex items-center gap-2">
              <Phone size={14} className="text-muted-foreground" />{" "}
              {account.phone}
            </p>
            <p className="text-sm text-foreground flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />{" "}
              {"No address on file"}
            </p>
            <p className="text-sm text-foreground flex items-center gap-2">
              <Calendar size={14} className="text-muted-foreground" /> Joined{" "}
              {new Date(account.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <ShoppingBag size={20} className="text-info mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">
              {accountOrders.length}
            </p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <TrendingUp size={20} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">
              ₹{totalSpent.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <Star size={20} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">
              ₹{avgOrderValue.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Order</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-extrabold text-foreground">
              {accountProfiles.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Profiles</p>
          </div>
        </div>
      </div>

      {/* Profiles */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-bold text-foreground mb-3">
          Profiles ({accountProfiles.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {accountProfiles.map((profile) => (
            <span
              key={profile._id}
              className="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary"
            >
              {profile.name}
            </span>
          ))}
          {accountProfiles.length === 0 && (
            <p className="text-sm text-muted-foreground">No profiles</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <p className="text-sm font-bold text-foreground">Order History</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Order
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Profile
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {accountOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-border last:border-0 hover:bg-secondary/20"
              >
                <td className="p-4 font-semibold text-foreground">
                  ORD-{order._id.slice(-4).toUpperCase()}
                </td>
                <td className="p-4 text-muted-foreground">
                  {order.profile?.name || "N/A"}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[order.status] || "bg-muted text-muted-foreground"}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {accountOrders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-muted-foreground"
                >
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PanelUserDetailPage;
