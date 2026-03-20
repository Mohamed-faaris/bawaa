import { useState } from "react";
import { FileText, CheckCircle2, XCircle, Phone, ImageIcon, Pencil, Plus, Trash2, Truck, MessageSquare } from "lucide-react";
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@bawaa/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { useAdminOrders, type OrderStatus, type AdminOrder } from "@/hooks/useAdminOrders";

const PanelPrescriptionsPage = () => {
  const { orders, updateStatus, addItem, removeItem } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemPrice, setNewItemPrice] = useState("");

  const prescriptionOrders = orders.filter((o) => o.type === "prescription");
  const order = selectedOrder ? orders.find((o) => o.id === selectedOrder.id) || null : null;
  const total = order ? order.items.reduce((sum, i) => sum + i.price * i.qty, 0) : 0;

  const allStatuses: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleAddItem = () => {
    if (!order || !newItemName || !newItemPrice) return;
    addItem(order.id, { name: newItemName, qty: parseInt(newItemQty) || 1, price: parseFloat(newItemPrice) || 0 });
    setNewItemName("");
    setNewItemQty("1");
    setNewItemPrice("");
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setIsEditing(false);
    setShowStatusMenu(false);
  };

  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Prescriptions</h1>
        <p className="text-sm text-muted-foreground">Review and verify uploaded prescriptions</p>
      </div>

      <div className="grid gap-4">
        {prescriptionOrders.map((rx, i) => {
          const rxTotal = rx.items.reduce((s, it) => s + it.price * it.qty, 0);
          return (
            <div
              key={rx.id}
              onClick={() => setSelectedOrder(rx)}
              className="bg-card rounded-xl border border-border p-5 flex items-start gap-5 hover:bg-secondary/20 transition-colors cursor-pointer"
            >
              {/* Preview */}
              <div className="w-32 h-40 bg-secondary/50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {rx.prescriptionUrl ? (
                  <img src={rx.prescriptionUrl} alt="Prescription" className="w-full h-full object-cover" />
                ) : (
                  <FileText size={32} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-foreground">{rx.id}</p>
                    <p className="text-sm text-muted-foreground">{rx.customer} · {rx.date}</p>
                    <p className="text-xs text-muted-foreground">{rx.phone}</p>
                  </div>
                  <StatusBadge status={rx.status} />
                </div>

                {rx.items.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-1">{rx.items.length} items · ₹{rxTotal}</p>
                )}
                {rx.items.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No items added yet</p>
                )}

                {rx.status === "pending" && (
                  <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" onClick={() => { updateStatus(rx.id, "processing"); toast.success(`${rx.id} → processing`); }} className="gap-1 bg-success hover:bg-success/90">
                      <CheckCircle2 size={14} /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { updateStatus(rx.id, "cancelled"); toast.success(`${rx.id} → cancelled`); }} className="gap-1 text-destructive">
                      <XCircle size={14} /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!order} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {order && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-extrabold">{order.id}</DialogTitle>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                    <ImageIcon size={10} /> Rx
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={order.status} />
                    {/* Override status pencil */}
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                        className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      {showStatusMenu && (
                        <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[150px]">
                          {allStatuses
                            .filter((s) => s.value !== order.status)
                            .map((s) => (
                              <button
                                key={s.value}
                                onClick={() => {
                                  updateStatus(order.id, s.value);
                                  setShowStatusMenu(false);
                                  toast.success(`${order.id} → ${s.label}`);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                              >
                                {s.label}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Customer + Call */}
              <div className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </div>
                <a
                  href={`tel:${order.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  <Phone size={14} /> Call
                </a>
              </div>

              {/* Prescription image */}
              {order.prescriptionUrl && (
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Prescription Image</p>
                  <img
                    src={order.prescriptionUrl}
                    alt="Prescription"
                    className="w-full h-56 object-cover rounded-lg border border-border bg-secondary"
                  />
                </div>
              )}

              {/* Items */}
              <div className="bg-secondary/30 rounded-xl p-4">
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
                  <p className="text-xs text-muted-foreground italic">No items yet — click Edit to add items from prescription</p>
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

                {isEditing && (
                  <div className="mt-3 space-y-2 p-3 rounded-lg bg-secondary/50">
                    <Input placeholder="Medicine name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="h-9 text-xs rounded-lg" />
                    <div className="flex gap-2">
                      <Input placeholder="Qty" type="number" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} className="h-9 text-xs rounded-lg w-20" />
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
              <div className="flex gap-2 items-center">
                {order.status === "pending" && (
                  <>
                    <Button onClick={() => { updateStatus(order.id, "processing"); toast.success(`${order.id} → processing`); }} className="flex-1 h-10 text-sm gap-1.5">
                      <CheckCircle2 size={15} /> Approve Order
                    </Button>
                    <Button variant="outline" onClick={() => { updateStatus(order.id, "cancelled"); toast.success(`${order.id} → cancelled`); }} className="h-10 text-sm text-destructive gap-1.5 px-4">
                      <XCircle size={15} /> Reject
                    </Button>
                  </>
                )}
                {order.status === "processing" && (
                  <Button onClick={() => { updateStatus(order.id, "ready"); toast.success(`${order.id} → ready`); }} className="flex-1 h-10 text-sm gap-1.5">
                    <Truck size={15} /> Mark Ready
                  </Button>
                )}
                {order.status === "ready" && (
                  <Button disabled className="flex-1 h-10 text-sm gap-1.5 opacity-60">
                    <Truck size={15} /> Waiting for Delivery
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPanelLayout>
  );
};

export default PanelPrescriptionsPage;
