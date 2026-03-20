import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, MapPin } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";

type FilterStatus = "all" | "processing" | "ready" | "delivered" | "cancelled";
const filters: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "processing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const profiles = [
  { initials: "RK", name: "Rajesh" },
  { initials: "PK", name: "Priya" },
  { initials: "AK", name: "Arjun" },
];

const orders = [
  {
    id: "ORD-1042",
    customer: "Rajesh Kumar",
    profile: "Rajesh",
    date: "2026-03-07",
    items: ["Paracetamol 500mg x2", "Amoxicillin 250mg x1", "Cough Syrup x1"],
    total: "₹485",
    status: "ready" as const,
    step: 3,
    address: "12, MG Road, Adyar, Chennai - 600020",
    phone: "+91 98765 43210",
    eta: "4:30 PM today",
  },
  {
    id: "ORD-1038",
    customer: "Priya Kumar",
    profile: "Priya",
    date: "2026-03-05",
    items: ["Vitamin D3 x1", "Calcium tablets x2"],
    total: "₹340",
    status: "processing" as const,
    step: 1,
    address: "45, Anna Nagar, Chennai - 600040",
    phone: "+91 87654 32109",
    eta: "Tomorrow morning",
  },
  {
    id: "ORD-1035",
    customer: "Rajesh Kumar",
    profile: "Rajesh",
    date: "2026-03-01",
    items: ["BP Monitor strips x1", "Metformin 500mg x2"],
    total: "₹1,230",
    status: "delivered" as const,
    step: 4,
    address: "12, MG Road, Adyar, Chennai - 600020",
    phone: "+91 98765 43210",
  },
  {
    id: "ORD-1029",
    customer: "Arjun Kumar",
    profile: "Arjun",
    date: "2026-02-25",
    items: ["Dolo 650 x3", "ORS sachets x5"],
    total: "₹320",
    status: "delivered" as const,
    step: 4,
    address: "90, Velachery, Chennai - 600042",
    phone: "+91 66554 43322",
  },
];

const steps = ["New", "Processing", "Ready", "Out for", "Delivered"];

const StepBar = ({ current }: { current: number }) => (
  <div className="mt-3">
    <div className="flex gap-1">
      {steps.map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1.5 rounded-full transition-colors ${
            i <= current ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
    <div className="flex justify-between mt-1">
      {steps.map((s) => (
        <span key={s} className="text-[9px] text-muted-foreground flex-1 text-center">
          {s}
        </span>
      ))}
    </div>
  </div>
);

const OrdersPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [profileFilter, setProfileFilter] = useState<string>("all");

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchProfile = profileFilter === "all" || o.profile === profileFilter;
    return matchStatus && matchProfile;
  });

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">My Orders</h1>
        <p className="text-sm text-muted-foreground mb-4">Track and manage your orders</p>

        {/* Profile filter */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setProfileFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              profileFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            All
          </button>
          {profiles.map((p) => (
            <button
              key={p.name}
              onClick={() => setProfileFilter(p.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                profileFilter === p.name ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-primary-foreground/20 flex items-center justify-center text-[8px] font-bold">
                {p.initials}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto mb-5 pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((order, i) => {
            const isOpen = expanded === order.id;
            const showSteps = !["delivered", "cancelled"].includes(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.customer} · {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={18} className="text-muted-foreground" />
                      </motion.div>
                    </div>
                  </div>

                  {showSteps && <StepBar current={order.step} />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Items</p>
                          {order.items.map((item) => (
                            <p key={item} className="text-sm text-foreground">{item}</p>
                          ))}
                          <p className="text-sm font-bold text-foreground mt-1">Total: {order.total}</p>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span>{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone size={14} className="shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                        {order.eta && (
                          <p className="text-xs text-primary font-semibold">
                            ETA: {order.eta}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default OrdersPage;
