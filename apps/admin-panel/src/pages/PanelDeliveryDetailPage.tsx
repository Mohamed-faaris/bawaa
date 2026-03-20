import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Truck, Star, Clock, CheckCircle2, XCircle, Calendar, Package } from "lucide-react";
import AdminPanelLayout from "@/components/AdminPanelLayout";

const staffData = [
  { id: "DEL-045", name: "Suresh Babu", phone: "+91 99887 76655", activeOrders: 2, delivered: 128, rating: 4.8, status: "active", joined: "Jun 2025", avgDeliveryTime: "28 min", completionRate: "97%", todayDeliveries: 6, thisWeek: 32, thisMonth: 128, earnings: "₹18,400", recentDeliveries: [{ orderId: "ORD-2048", customer: "Rajesh Kumar", address: "12, MG Road", time: "10 min ago", status: "On the Way" }, { orderId: "ORD-2050", customer: "Sneha Iyer", address: "45, Anna Nagar", time: "25 min ago", status: "Picked Up" }, { orderId: "ORD-2044", customer: "Priya Kumar", address: "12, MG Road", time: "1 hr ago", status: "Delivered" }, { orderId: "ORD-2042", customer: "Lakshmi Devi", address: "23, Adyar", time: "2 hrs ago", status: "Delivered" }] },
  { id: "DEL-032", name: "Karthik R", phone: "+91 88776 65544", activeOrders: 1, delivered: 95, rating: 4.5, status: "active", joined: "Aug 2025", avgDeliveryTime: "32 min", completionRate: "94%", todayDeliveries: 4, thisWeek: 22, thisMonth: 95, earnings: "₹12,800", recentDeliveries: [{ orderId: "ORD-2041", customer: "Priya Kumar", address: "12, MG Road", time: "15 min ago", status: "Picked Up" }, { orderId: "ORD-2040", customer: "Kavitha S", address: "15, Tambaram", time: "2 hrs ago", status: "Failed" }, { orderId: "ORD-2038", customer: "Mohammed Ali", address: "78, T Nagar", time: "3 hrs ago", status: "Delivered" }] },
  { id: "DEL-018", name: "Vignesh P", phone: "+91 77665 54433", activeOrders: 0, delivered: 210, rating: 4.9, status: "offline", joined: "Feb 2025", avgDeliveryTime: "24 min", completionRate: "99%", todayDeliveries: 0, thisWeek: 0, thisMonth: 45, earnings: "₹24,200", recentDeliveries: [{ orderId: "ORD-2034", customer: "Mohammed Ali", address: "78, T Nagar", time: "Yesterday", status: "Delivered" }, { orderId: "ORD-2030", customer: "Lakshmi Devi", address: "23, Adyar", time: "Yesterday", status: "Delivered" }] },
];

const deliveryStatusStyles: Record<string, string> = {
  "On the Way": "bg-info/15 text-info",
  "Picked Up": "bg-warning/15 text-warning",
  "Delivered": "bg-success/15 text-success",
  "Failed": "bg-destructive/15 text-destructive",
};

const PanelDeliveryDetailPage = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const staff = staffData.find((s) => s.id === staffId);

  if (!staff) {
    return (
      <AdminPanelLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Staff not found</p>
          <button onClick={() => navigate("/panel/deliveries")} className="text-primary text-sm mt-2">Go back</button>
        </div>
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/panel/deliveries")} className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground">{staff.name}</h1>
            <span className="text-sm text-muted-foreground">{staff.id}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${staff.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground capitalize">{staff.status}</span>
          </div>
          <p className="text-sm text-muted-foreground">Joined {staff.joined}</p>
        </div>
        <a
          href={`tel:${staff.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          <Phone size={15} /> Call
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Package size={18} className="text-info mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">{staff.delivered}</p>
          <p className="text-xs text-muted-foreground">Total Delivered</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Star size={18} className="text-warning mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">{staff.rating}</p>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Clock size={18} className="text-accent mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">{staff.avgDeliveryTime}</p>
          <p className="text-xs text-muted-foreground">Avg. Time</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <CheckCircle2 size={18} className="text-success mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">{staff.completionRate}</p>
          <p className="text-xs text-muted-foreground">Completion</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <Truck size={18} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground">{staff.activeOrders}</p>
          <p className="text-xs text-muted-foreground">Active Now</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-2xl font-extrabold text-foreground">{staff.earnings}</p>
          <p className="text-xs text-muted-foreground mt-1">Earnings</p>
        </div>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Today</p>
          <p className="text-3xl font-extrabold text-foreground">{staff.todayDeliveries}</p>
          <p className="text-xs text-muted-foreground">deliveries</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-1">This Week</p>
          <p className="text-3xl font-extrabold text-foreground">{staff.thisWeek}</p>
          <p className="text-xs text-muted-foreground">deliveries</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-1">This Month</p>
          <p className="text-3xl font-extrabold text-foreground">{staff.thisMonth}</p>
          <p className="text-xs text-muted-foreground">deliveries</p>
        </div>
      </div>

      {/* Recent Deliveries table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <p className="text-sm font-bold text-foreground">Recent Deliveries</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">Order</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Address</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Time</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.recentDeliveries.map((d) => (
              <tr key={d.orderId} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-4 font-semibold text-foreground">{d.orderId}</td>
                <td className="p-4 text-foreground">{d.customer}</td>
                <td className="p-4 text-muted-foreground">{d.address}</td>
                <td className="p-4 text-muted-foreground">{d.time}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deliveryStatusStyles[d.status] || "bg-muted text-muted-foreground"}`}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelDeliveryDetailPage;
