import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ImageIcon, ChevronRight } from "lucide-react";
import { Input } from "@bawaa/ui/input";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { useAdminOrders, type OrderStatus } from "@/hooks/useAdminOrders";

const tabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
];

const AdminMobileOrdersPage = () => {
  const { orders } = useAdminOrders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getTotal = (items: { price: number; qty: number }[]) => items.reduce((s, i) => s + i.price * i.qty, 0);

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
              onClick={() => setFilter(tab.value)}
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
            const total = getTotal(order.items);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/admin-mobile/orders/${order.id}`)}
                className="glass-card p-4 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{order.id}</p>
                      {order.type === "prescription" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                          <ImageIcon size={10} /> Rx
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.customer} · {order.items.length > 0 ? `${order.items.length} items` : "Prescription"} · {order.date}
                    </p>
                    {total > 0 && <p className="text-xs font-bold text-foreground mt-0.5">₹{total}</p>}
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
      </div>
    </PageTransition>
  );
};

export default AdminMobileOrdersPage;
