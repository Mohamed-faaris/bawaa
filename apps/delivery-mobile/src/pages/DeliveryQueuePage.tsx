import { motion } from "framer-motion";
import { Package, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const readyOrders = [
  { id: "ORD-2048", customer: "Rajesh Kumar", address: "12, MG Road, Chennai", items: 3, time: "10 min ago" },
  { id: "ORD-2050", customer: "Sneha Iyer", address: "45, Anna Nagar, Chennai", items: 2, time: "5 min ago" },
  { id: "ORD-2051", customer: "Mohammed Ali", address: "78, T Nagar, Chennai", items: 4, time: "2 min ago" },
  { id: "ORD-2053", customer: "Lakshmi Devi", address: "23, Adyar, Chennai", items: 1, time: "Just now" },
];

const DeliveryQueuePage = () => {
  const navigate = useNavigate();

  const handleAccept = (id: string) => {
    toast.success(`Order ${id} accepted!`, { description: "Added to your deliveries." });
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-extrabold text-foreground">Ready for Delivery</h1>
          <span className="text-xs font-semibold bg-info/15 text-info px-2.5 py-1 rounded-full">
            {readyOrders.length} orders
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Accept orders to start delivering</p>

        <div className="space-y-3">
          {readyOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                    <Package size={18} className="text-info" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> {order.time}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin size={12} /> {order.address}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate(`/delivery/order/${order.id}`)}
                  variant="outline"
                  className="flex-1 rounded-lg text-xs h-9"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(order.id)}
                  className="flex-1 rounded-lg text-xs h-9 bg-info hover:bg-info/90 gap-1"
                >
                  <CheckCircle2 size={14} /> Accept
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default DeliveryQueuePage;
