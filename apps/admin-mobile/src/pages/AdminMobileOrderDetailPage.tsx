import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, ImageIcon, Pencil, Plus, Trash2, CheckCircle2, XCircle, Truck, ChevronDown } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { useAdminOrders, type OrderStatus } from "@/hooks/useAdminOrders";

const AdminMobileOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateStatus, addItem, removeItem } = useAdminOrders();

  const order = orders.find((o) => o.id === orderId);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemPrice, setNewItemPrice] = useState("");

  const allStatuses: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (!order) {
    return (
      <PageTransition>
        <div className="app-container screen-padding text-center pt-20">
          <p className="text-muted-foreground">Order not found</p>
          <Button variant="ghost" onClick={() => navigate("/admin-mobile/orders")} className="mt-4">Go back</Button>
        </div>
      </PageTransition>
    );
  }

  const total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) return;
    addItem(order.id, { name: newItemName, qty: parseInt(newItemQty) || 1, price: parseFloat(newItemPrice) || 0 });
    setNewItemName("");
    setNewItemQty("1");
    setNewItemPrice("");
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate("/admin-mobile/orders")} className="p-1.5 rounded-lg bg-secondary text-foreground">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-foreground">{order.id}</h1>
              {order.type === "prescription" && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                  <ImageIcon size={10} /> Rx
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{order.date}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Customer + Call */}
        <div className="glass-card p-4 mb-3">
          <p className="text-sm font-semibold text-foreground">{order.customer}</p>
          <p className="text-xs text-muted-foreground mb-3">{order.phone}</p>
          <a
            href={`tel:${order.phone.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold w-full"
          >
            <Phone size={16} />
            Call Customer
          </a>
        </div>

        {/* Prescription image */}
        {order.type === "prescription" && order.prescriptionUrl && (
          <div className="glass-card p-4 mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Prescription Image</p>
            <img
              src={order.prescriptionUrl}
              alt="Prescription"
              className="w-full h-48 object-cover rounded-lg border border-border bg-secondary"
            />
          </div>
        )}

        {/* Items */}
        <div className="glass-card p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Items {order.items.length > 0 && `(${order.items.length})`}
            </p>
            {(order.status === "pending" || order.status === "processing") && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-primary font-semibold flex items-center gap-1"
              >
                <Pencil size={11} /> {isEditing ? "Done" : "Edit"}
              </button>
            )}
          </div>

          {order.items.length === 0 && !isEditing && (
            <p className="text-xs text-muted-foreground italic">No items yet — tap Edit to add items from prescription</p>
          )}

          <div className="space-y-0">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">Qty: {item.qty} × ₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">₹{item.qty * item.price}</p>
                  {isEditing && (
                    <button onClick={() => removeItem(order.id, idx)} className="text-destructive p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add item form */}
          {isEditing && (
            <div className="mt-3 space-y-2 p-3 rounded-lg bg-secondary/50">
              <Input placeholder="Medicine name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="h-9 text-xs rounded-lg" />
              <div className="flex gap-2">
                <Input placeholder="Qty" type="number" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} className="h-9 text-xs rounded-lg w-16" />
                <Input placeholder="Price ₹" type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="h-9 text-xs rounded-lg flex-1" />
                <Button size="sm" onClick={handleAddItem} className="h-9 text-xs rounded-lg gap-1 px-3">
                  <Plus size={12} /> Add
                </Button>
              </div>
            </div>
          )}

          {order.items.length > 0 && (
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <p className="text-sm font-bold text-foreground">Total</p>
              <p className="text-sm font-bold text-foreground">₹{total}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 items-center">
          {order.status === "pending" && (
            <>
              <Button onClick={() => { updateStatus(order.id, "processing"); navigate("/admin-mobile/orders"); }} className="flex-1 rounded-xl h-11 text-sm gap-1.5">
                <CheckCircle2 size={15} /> Approve Order
              </Button>
              <Button variant="outline" onClick={() => { updateStatus(order.id, "cancelled"); navigate("/admin-mobile/orders"); }} className="rounded-xl h-11 text-sm text-destructive gap-1.5 px-4">
                <XCircle size={15} /> Reject
              </Button>
            </>
          )}
          {order.status === "processing" && (
            <Button onClick={() => { updateStatus(order.id, "ready"); navigate("/admin-mobile/orders"); }} className="flex-1 rounded-xl h-11 text-sm bg-accent hover:bg-accent/90 gap-1.5">
              <Truck size={15} /> Mark Ready
            </Button>
          )}
          {order.status === "ready" && (
            <Button disabled className="flex-1 rounded-xl h-11 text-sm gap-1.5 opacity-60">
              <Truck size={15} /> Waiting for Delivery
            </Button>
          )}
          {(order.status === "delivered" || order.status === "cancelled") && (
            <div className="flex-1" />
          )}

          {/* Override status pencil */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil size={15} />
            </button>
            {showStatusMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[150px]"
              >
                {allStatuses
                  .filter((s) => s.value !== order.status)
                  .map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        updateStatus(order.id, s.value);
                        setShowStatusMenu(false);
                        toast.success(`Status → ${s.label}`);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileOrderDetailPage;
