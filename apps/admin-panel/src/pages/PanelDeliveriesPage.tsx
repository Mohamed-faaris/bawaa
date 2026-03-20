import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { motion } from "framer-motion";
import { Truck, Star } from "lucide-react";

const deliveryStaff = [
  { id: "DEL-045", name: "Suresh Babu", phone: "+91 99887 76655", activeOrders: 2, delivered: 128, rating: 4.8, status: "active" },
  { id: "DEL-032", name: "Karthik R", phone: "+91 88776 65544", activeOrders: 1, delivered: 95, rating: 4.5, status: "active" },
  { id: "DEL-018", name: "Vignesh P", phone: "+91 77665 54433", activeOrders: 0, delivered: 210, rating: 4.9, status: "offline" },
];

const activeDeliveries = [
  { orderId: "ORD-2048", staff: "Suresh Babu", customer: "Rajesh Kumar", address: "12, MG Road", status: "On the Way" },
  { orderId: "ORD-2050", staff: "Suresh Babu", customer: "Sneha Iyer", address: "45, Anna Nagar", status: "Picked Up" },
  { orderId: "ORD-2041", staff: "Karthik R", customer: "Priya Kumar", address: "12, MG Road", status: "Picked Up" },
];

const deliveryStatusStyles: Record<string, string> = {
  "On the Way": "bg-info/15 text-info",
  "Picked Up": "bg-warning/15 text-warning",
  "Delivered": "bg-success/15 text-success",
  "Failed": "bg-destructive/15 text-destructive",
};

const PanelDeliveriesPage = () => {
  const navigate = useNavigate();

  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Delivery Management</h1>
        <p className="text-sm text-muted-foreground">Monitor staff and track deliveries</p>
      </div>

      <h3 className="font-bold text-foreground mb-3">Delivery Staff</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {deliveryStaff.map((staff, i) => (
          <motion.div
            key={staff.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/panel/deliveries/${staff.id}`)}
            className="bg-card rounded-xl border border-border p-5 hover:bg-secondary/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <Truck size={18} className="text-info" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{staff.name}</p>
                <p className="text-xs text-muted-foreground">{staff.id}</p>
              </div>
              <div className={`ml-auto w-2.5 h-2.5 rounded-full ${staff.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-extrabold text-foreground">{staff.activeOrders}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground">{staff.delivered}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground flex items-center justify-center gap-0.5">
                  {staff.rating} <Star size={12} className="text-warning" />
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="font-bold text-foreground mb-3">Active Deliveries</h3>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">Order</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Staff</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Address</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeDeliveries.map((d) => (
              <tr key={d.orderId} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-4 font-semibold text-foreground">{d.orderId}</td>
                <td className="p-4 text-foreground">{d.staff}</td>
                <td className="p-4 text-muted-foreground">{d.customer}</td>
                <td className="p-4 text-muted-foreground">{d.address}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deliveryStatusStyles[d.status] || "bg-info/15 text-info"}`}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelDeliveriesPage;
