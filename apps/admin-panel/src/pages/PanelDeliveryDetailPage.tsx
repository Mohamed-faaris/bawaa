import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Truck, Package } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useEffect } from "react";

const deliveryStatusStyles: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-warning/15 text-warning",
  ready: "bg-info/15 text-info",
  out_for_delivery: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
};

const PanelDeliveryDetailPage = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const orders = useQuery(api.admin.listOrders);

  useEffect(() => {
    console.log("[PanelDeliveryDetailPage] Data fetch status:", {
      orders:
        orders === undefined
          ? "loading..."
          : `loaded ${(orders || []).length} orders`,
    });
  }, [orders]);

  if (orders === undefined) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const activeOrders = (orders || []).filter(
    (o) => o.status === "out_for_delivery" || o.status === "ready",
  );
  const deliveredOrders = (orders || []).filter(
    (o) => o.status === "delivered",
  );

  const today = new Date().toDateString();
  const todayDeliveries = deliveredOrders.filter(
    (o) => new Date(o.updatedAt).toDateString() === today,
  );

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const thisWeekDeliveries = deliveredOrders.filter(
    (o) => new Date(o.updatedAt) >= weekStart,
  );

  const monthStart = new Date();
  monthStart.setDate(1);
  const thisMonthDeliveries = deliveredOrders.filter(
    (o) => new Date(o.updatedAt) >= monthStart,
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/panel/deliveries")}
          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground">
              Delivery Overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {staffId ? `Staff ID: ${staffId}` : "All deliveries"}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Package size={18} className="text-info mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">
            {deliveredOrders.length}
          </p>
          <p className="text-xs text-muted-foreground">Total Delivered</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Truck size={18} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">
            {activeOrders.length}
          </p>
          <p className="text-xs text-muted-foreground">Active Now</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-2xl font-extrabold text-foreground">
            {todayDeliveries.length}
          </p>
          <p className="text-xs text-muted-foreground">Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-2xl font-extrabold text-foreground">
            {thisWeekDeliveries.length}
          </p>
          <p className="text-xs text-muted-foreground">This Week</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-2xl font-extrabold text-foreground">
            {thisMonthDeliveries.length}
          </p>
          <p className="text-xs text-muted-foreground">This Month</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-2xl font-extrabold text-foreground">
            {orders.length}
          </p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
      </div>

      {/* Active Deliveries */}
      {activeOrders.length > 0 && (
        <>
          <h3 className="font-bold text-foreground mb-3">Active Deliveries</h3>
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      ORD-{order._id.slice(-4).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.account?.name} - {order.profile?.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${deliveryStatusStyles[order.status] || "bg-muted text-muted-foreground"}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent Deliveries table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <p className="text-sm font-bold text-foreground">Recent Deliveries</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Order
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground">
                Customer
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
            {orders.slice(0, 20).map((order) => (
              <tr
                key={order._id}
                className="border-b border-border last:border-0 hover:bg-secondary/20"
              >
                <td className="p-4 font-semibold text-foreground">
                  ORD-{order._id.slice(-4).toUpperCase()}
                </td>
                <td className="p-4 text-foreground">
                  {order.account?.name || "Unknown"}
                </td>
                <td className="p-4 text-muted-foreground">
                  {order.profile?.name || "N/A"}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${deliveryStatusStyles[order.status] || "bg-muted text-muted-foreground"}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-muted-foreground"
                >
                  No deliveries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PanelDeliveryDetailPage;
