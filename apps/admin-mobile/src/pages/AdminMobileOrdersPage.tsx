import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ImageIcon, ChevronRight } from "lucide-react";
import { Input } from "@bawaa/ui/input";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  formatOrderCode,
  useAdminOrders,
  type OrderStatus,
} from "@/hooks/useAdminOrders";

const tabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Ordered", value: "ordered" },
  { label: "Processing", value: "processing" },
  { label: "Ready", value: "ready" },
  { label: "Out for delivery", value: "out_for_delivery" },
  { label: "Delivered", value: "delivered" },
];

const AdminMobileOrdersPage = () => {
  const { orders } = useAdminOrders();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusParam = searchParams.get("status") as OrderStatus | "all" | null;
  const filter = statusParam && tabs.some((t) => t.value === statusParam) ? statusParam : "all";

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      formatOrderCode(o._id).toLowerCase().includes(search.toLowerCase()) ||
      (o.account?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      o.profile.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-4">Order Queue</h1>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl bg-card border-border text-sm" />
        </div>

        <div className="flex gap-2 overflow-x-auto mb-4 pb-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSearchParams(tab.value === "all" ? {} : { status: tab.value })}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                filter === tab.value ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((order, i) => {
            const prescriptionItems = order.prescription?.items ?? [];
            const itemCount = prescriptionItems.length;
            const hasPrescriptionImage =
              !!order.prescription?.storageId || !!order.prescription?.imageUrl;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/admin-mobile/orders/${order._id}`)}
                className="glass-card p-4 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">
                        {formatOrderCode(order._id)}
                      </p>
                      {hasPrescriptionImage && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                          <ImageIcon size={10} /> Rx
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.account?.name || "Unknown customer"} ·{" "}
                      {order.profile.name} ·{" "}
                      {itemCount > 0 ? `${itemCount} items` : "Prescription"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="glass-card p-5 text-center text-sm text-muted-foreground">
            No orders match the current filters.
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminMobileOrdersPage;
