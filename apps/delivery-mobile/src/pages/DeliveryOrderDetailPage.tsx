import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Package, FileText, CreditCard } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const DeliveryOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-xl font-extrabold text-foreground mb-1">{orderId}</h1>
        <p className="text-sm text-muted-foreground mb-6">Order details</p>

        <div className="space-y-4">
          {/* Customer Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Customer</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Rajesh Kumar</p>
              <p className="flex items-center gap-1.5"><Phone size={14} /> +91 98765 43210</p>
              <p className="flex items-center gap-1.5"><MapPin size={14} /> 12, MG Road, Chennai</p>
            </div>
          </motion.div>

          {/* Prescription */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <FileText size={16} /> Prescription
            </h3>
            <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground">
              Prescription image placeholder
            </div>
          </motion.div>

          {/* Medicines */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <Package size={16} /> Medicines
            </h3>
            <div className="space-y-2">
              {["Paracetamol 500mg x 10", "Amoxicillin 250mg x 15", "Vitamin D3 x 30"].map((med) => (
                <div key={med} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{med}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <CreditCard size={16} /> Billing
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹435</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-foreground">₹50</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-1.5 mt-1.5"><span className="text-foreground">Total</span><span className="text-foreground">₹485</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DeliveryOrderDetailPage;
