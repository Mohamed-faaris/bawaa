import { motion } from "framer-motion";
import { Package, MapPin, Phone, Navigation, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { useState } from "react";

type DeliveryStatus = "picked" | "on_the_way" | "delivered" | "failed";

const myDeliveries = [
  { id: "ORD-2048", customer: "Rajesh Kumar", phone: "+91 98765 43210", address: "12, MG Road, Chennai", items: 3, status: "picked" as DeliveryStatus },
  { id: "ORD-2050", customer: "Sneha Iyer", phone: "+91 87654 32109", address: "45, Anna Nagar, Chennai", items: 2, status: "on_the_way" as DeliveryStatus },
];

const statusLabels: Record<DeliveryStatus, { label: string; className: string }> = {
  picked: { label: "Picked Up", className: "bg-warning/15 text-warning" },
  on_the_way: { label: "On the Way", className: "bg-info/15 text-info" },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive" },
};

const MyDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState(myDeliveries);

  const updateStatus = (id: string, status: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    toast.success(`${id} marked as ${statusLabels[status].label}`);
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">My Deliveries</h1>
        <p className="text-sm text-muted-foreground mb-6">{deliveries.length} active deliveries</p>

        <div className="space-y-3">
          {deliveries.map((d, i) => {
            const st = statusLabels[d.status];
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{d.id}</p>
                    <p className="text-xs text-muted-foreground">{d.customer}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.className}`}>
                    {st.label}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <p className="flex items-center gap-1.5"><MapPin size={12} /> {d.address}</p>
                  <p className="flex items-center gap-1.5"><Phone size={12} /> {d.phone}</p>
                  <p className="flex items-center gap-1.5"><Package size={12} /> {d.items} items</p>
                </div>

                <div className="flex gap-2">
                  {d.status === "picked" && (
                    <Button size="sm" onClick={() => updateStatus(d.id, "on_the_way")} className="flex-1 rounded-lg text-xs h-9 bg-info hover:bg-info/90 gap-1">
                      <Navigation size={14} /> Start Delivery
                    </Button>
                  )}
                  {d.status === "on_the_way" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(d.id, "delivered")} className="flex-1 rounded-lg text-xs h-9 bg-success hover:bg-success/90 gap-1">
                        <CheckCircle2 size={14} /> Delivered
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(d.id, "failed")} className="rounded-lg text-xs h-9 text-destructive gap-1">
                        <XCircle size={14} /> Failed
                      </Button>
                    </>
                  )}
                  {(d.status === "delivered" || d.status === "failed") && (
                    <p className={`text-xs font-semibold ${d.status === "delivered" ? "text-success" : "text-destructive"}`}>
                      {st.label}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default MyDeliveriesPage;
