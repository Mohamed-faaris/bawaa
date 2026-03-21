import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";
import { toast } from "@bawaa/ui/use-toast";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

const PrescriptionHistoryPage = () => {
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

  const handleReorder = (orderId: string) => {
    toast({
      title: "Reorder initiated!",
      description: `Order ${orderId} has been added.`,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const deliveredOrders = orders?.filter((o) => o.status === "delivered") || [];

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">
          Prescription History
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          View past prescriptions and reorder
        </p>

        <div className="space-y-4">
          {deliveredOrders.length > 0 ? (
            deliveredOrders.map(
              (
                order: {
                  _id: Id<"orders">;
                  createdAt: number;
                  prescription?: string;
                },
                i: number,
              ) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          ORD-{order._id.slice(-4).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.prescription
                            ? "Prescription uploaded"
                            : "No prescription"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order._id)}
                      className="gap-1.5 rounded-lg text-xs h-8"
                    >
                      <RotateCcw size={14} /> Reorder
                    </Button>
                  </div>
                </motion.div>
              ),
            )
          ) : (
            <div className="text-center py-12">
              <FileText
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground">
                No prescription history yet
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PrescriptionHistoryPage;
