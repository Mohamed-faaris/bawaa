import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Star, ShoppingBag, TrendingUp, Calendar } from "lucide-react";
import AdminPanelLayout from "@/components/AdminPanelLayout";

const usersData = [
  { id: "u1", name: "Rajesh Kumar", phone: "+91 98765 43210", orders: 28, profiles: 3, lastOrder: "Mar 5, 2026", joined: "Jan 2025", totalSpent: "₹24,500", avgOrderValue: "₹875", address: "12, MG Road, Chennai", recentOrders: [{ id: "ORD-2048", date: "Mar 5", total: "₹910", status: "processing" }, { id: "ORD-2039", date: "Feb 25", total: "₹450", status: "delivered" }, { id: "ORD-2031", date: "Feb 18", total: "₹1,200", status: "delivered" }, { id: "ORD-2025", date: "Feb 10", total: "₹680", status: "delivered" }], profileNames: ["Rajesh", "Mother - Kamala", "Father - Suresh"] },
  { id: "u2", name: "Sneha Iyer", phone: "+91 87654 32109", orders: 22, profiles: 1, lastOrder: "Mar 7, 2026", joined: "Mar 2025", totalSpent: "₹18,200", avgOrderValue: "₹827", address: "45, Anna Nagar, Chennai", recentOrders: [{ id: "ORD-2050", date: "Mar 7", total: "₹340", status: "processing" }, { id: "ORD-2038", date: "Feb 24", total: "₹720", status: "delivered" }], profileNames: ["Sneha"] },
  { id: "u3", name: "Mohammed Ali", phone: "+91 88776 65544", orders: 19, profiles: 2, lastOrder: "Mar 8, 2026", joined: "May 2025", totalSpent: "₹15,800", avgOrderValue: "₹831", address: "78, T Nagar, Chennai", recentOrders: [{ id: "ORD-2051", date: "Mar 8", total: "₹920", status: "pending" }, { id: "ORD-2037", date: "Feb 22", total: "₹560", status: "delivered" }], profileNames: ["Mohammed", "Wife - Fatima"] },
  { id: "u4", name: "Lakshmi Devi", phone: "+91 77665 54433", orders: 15, profiles: 1, lastOrder: "Mar 8, 2026", joined: "Jul 2025", totalSpent: "₹9,400", avgOrderValue: "₹627", address: "23, Adyar, Chennai", recentOrders: [{ id: "ORD-2053", date: "Mar 8", total: "₹180", status: "pending" }, { id: "ORD-2036", date: "Feb 21", total: "₹390", status: "delivered" }], profileNames: ["Lakshmi"] },
  { id: "u5", name: "Arun Prasad", phone: "+91 66554 43322", orders: 12, profiles: 2, lastOrder: "Feb 20, 2026", joined: "Sep 2025", totalSpent: "₹7,600", avgOrderValue: "₹633", address: "90, Velachery, Chennai", recentOrders: [{ id: "ORD-2035", date: "Feb 20", total: "₹320", status: "delivered" }, { id: "ORD-2028", date: "Feb 12", total: "₹510", status: "delivered" }], profileNames: ["Arun", "Son - Kiran"] },
];

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  processing: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

const PanelUserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = usersData.find((u) => u.id === userId);

  if (!user) {
    return (
      <AdminPanelLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">User not found</p>
          <button onClick={() => navigate("/panel/users")} className="text-primary text-sm mt-2">Go back</button>
        </div>
      </AdminPanelLayout>
    );
  }

  return (
    <AdminPanelLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/panel/users")} className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">Customer since {user.joined}</p>
        </div>
        <a
          href={`tel:${user.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          <Phone size={15} /> Call Customer
        </a>
      </div>

      {/* Info + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contact card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Contact Info</p>
          <div className="space-y-2.5">
            <p className="text-sm text-foreground flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /> {user.phone}</p>
            <p className="text-sm text-foreground flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" /> {user.address}</p>
            <p className="text-sm text-foreground flex items-center gap-2"><Calendar size={14} className="text-muted-foreground" /> Joined {user.joined}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <ShoppingBag size={20} className="text-info mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">{user.orders}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <TrendingUp size={20} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">{user.totalSpent}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <Star size={20} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-extrabold text-foreground">{user.avgOrderValue}</p>
            <p className="text-xs text-muted-foreground">Avg. Order</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-extrabold text-foreground">{user.profiles}</p>
            <p className="text-xs text-muted-foreground mt-1">Profiles</p>
          </div>
        </div>
      </div>

      {/* Profiles */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-bold text-foreground mb-3">Profiles ({user.profiles})</p>
        <div className="flex flex-wrap gap-2">
          {user.profileNames.map((name) => (
            <span key={name} className="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <p className="text-sm font-bold text-foreground">Order History</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-4 font-semibold text-muted-foreground">Order</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
              <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {user.recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-4 font-semibold text-foreground">{o.id}</td>
                <td className="p-4 text-muted-foreground">{o.date}</td>
                <td className="p-4 font-semibold text-foreground">{o.total}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelUserDetailPage;
