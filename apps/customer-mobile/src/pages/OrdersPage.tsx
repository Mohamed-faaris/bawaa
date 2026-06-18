import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Image } from "lucide-react";
import { useQuery, useAction } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";

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
  const { accountId } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const orders = useQuery(api.orders.listByAccount, {
    accountId,
  });

  const getImageUrl = useAction(api.storage.getImageUrl);

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!orders) return;

      const newUrls: Record<string, string> = {};
      for (const order of orders) {
        if (
          order.prescription?.storageId &&
          !imageUrls[order.prescription.storageId]
        ) {
          try {
            const url = await getImageUrl({
              storageId: order.prescription.storageId,
            });
            if (url) {
              newUrls[order.prescription.storageId] = url;
            }
          } catch (e) {
            console.error("Failed to get image URL:", e);
          }
        }
      }
      if (Object.keys(newUrls).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...newUrls }));
      }
    };

    fetchImageUrls();
  }, [orders]);

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
                  prescription?: {
                    imageUrl?: string;
                    storageId?: string;
                    notes?: string;
                  };
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
                              {order.prescription?.storageId &&
                              imageUrls[order.prescription.storageId] ? (
                                <img
                                  src={imageUrls[order.prescription.storageId]}
                                  alt="Prescription"
                                  className="w-full h-48 object-cover rounded-lg border border-border"
                                />
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Image size={16} />
                                  <span>No prescription image</span>
                                </div>
                              )}
                              {order.prescription?.notes && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Notes: {order.prescription.notes}
                                </p>
                              )}
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
