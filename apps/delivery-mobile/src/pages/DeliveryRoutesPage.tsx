import { motion } from "framer-motion";
import { MapPin, Navigation2, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const routes = [
  { id: "1", order: "ORD-2048", customer: "Rajesh Kumar", address: "12, MG Road, Chennai", distance: "2.3 km", eta: "8 min" },
  { id: "2", order: "ORD-2050", customer: "Sneha Iyer", address: "45, Anna Nagar, Chennai", distance: "5.1 km", eta: "18 min" },
];

const DeliveryRoutesPage = () => {
  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Delivery Routes</h1>
        <p className="text-sm text-muted-foreground mb-6">Your delivery addresses</p>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card h-48 mb-6 flex items-center justify-center bg-secondary/50"
        >
          <div className="text-center">
            <Navigation2 size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Map view coming soon</p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {routes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{route.customer}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin size={12} /> {route.address}
                </p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Navigation2 size={11} /> {route.distance}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {route.eta}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default DeliveryRoutesPage;
