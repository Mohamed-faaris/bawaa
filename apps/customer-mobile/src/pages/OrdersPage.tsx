import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

type FilterStatus = "all" | "processing" | "ready" | "delivered";

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "processing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
];

const steps = ["New", "Processing", "Ready", "Out for", "Delivered"];

const statusToStep: Record<string, number> = {
  ordered: 0,
  processing: 1,
  ready: 2,
  out_for_delivery: 3,
  delivered: 4,
};

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
        <span
          key={s}
          className="text-[9px] text-muted-foreground flex-1 text-center"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

const OrdersPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [accountId, setAccountId] = useState<Id<"accounts"> | null>(null);

  const orders = useQuery(api.orders.listByAccount, {
    accountId: accountId ?? null,
  });

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    if (storedAccountId) {
      setAccountId(storedAccountId as Id<"accounts">);
    }
  }, []);

  const filtered =
    orders?.filter((o) => {
      return filter === "all" || o.status === filter;
    }) || [];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">
          My Orders
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Track and manage your orders
        </p>

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
          {filtered.length > 0 ? (
            filtered.map(
              (
                order: {
                  _id: Id<"orders">;
                  status: string;
                  createdAt: number;
                  prescription?: string;
                },
                i: number,
              ) => {
                const isOpen = expanded === order._id;
                const currentStep = statusToStep[order.status] || 0;
                const showSteps = order.status !== "delivered";

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-foreground">
                            ORD-{order._id.slice(-4).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown
                              size={18}
                              className="text-muted-foreground"
                            />
                          </motion.div>
                        </div>
                      </div>

                      {showSteps && <StepBar current={currentStep} />}
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
                              <p className="text-xs font-semibold text-muted-foreground mb-1">
                                Prescription
                              </p>
                              <p className="text-sm text-foreground">
                                {order.prescription || "No prescription image"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              },
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default OrdersPage;
