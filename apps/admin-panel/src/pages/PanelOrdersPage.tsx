import { useState } from "react";
import { Search, CheckCircle2, XCircle, Truck, Phone, ImageIcon, Pencil, Plus, Trash2, ChevronDown } from "lucide-react";
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@bawaa/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { useAdminOrders, type OrderStatus, type AdminOrder } from "@/hooks/useAdminOrders";

const PanelOrdersPage = () => {
  const { orders, updateStatus, addItem, removeItem } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const filtered = orders.filter((o) => {
    const matchFilter = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Keep selectedOrder in sync with global state
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "processing", "ready", "delivered", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg capitalize transition-colors ${
                filterStatus === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-semibold text-muted-foreground">Order</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Items</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const rowTotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
                return (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-semibold text-foreground">{o.id}</td>
                    <td className="p-4">
                      <p className="text-foreground">{o.customer}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">{o.date}</td>
                    <td className="p-4">
                      {o.type === "prescription" ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-1 w-fit">
                          <ImageIcon size={11} /> Rx
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Items</span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">{o.items.length || "—"}</td>
                    <td className="p-4 font-semibold text-foreground">{rowTotal > 0 ? `₹${rowTotal}` : "—"}</td>
                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {o.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => { updateStatus(o.id, "processing"); toast.success(`${o.id} → processing`); }} className="h-7 text-xs gap-1">
                              <CheckCircle2 size={12} /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { updateStatus(o.id, "cancelled"); toast.success(`${o.id} → cancelled`); }} className="h-7 text-xs text-destructive gap-1">
                              <XCircle size={12} />
                            </Button>
                          </>
                        )}
                        {o.status === "processing" && (
                          <Button size="sm" variant="outline" onClick={() => { updateStatus(o.id, "ready"); toast.success(`${o.id} → ready`); }} className="h-7 text-xs gap-1">
                            <Truck size={12} /> Ready
                          </Button>
                        )}
                        {o.status === "ready" && (
                          <span className="text-xs text-muted-foreground italic">Waiting for delivery</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!order} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {order && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-extrabold">{order.id}</DialogTitle>
                  {order.type === "prescription" && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                      <ImageIcon size={10} /> Rx
                    </span>
                  )}
                  <StatusBadge status={order.status} />
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
              {order.type === "prescription" && order.prescriptionUrl && (
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Prescription Image</p>
                  <img
                    src={order.prescriptionUrl}
                    alt="Prescription"
                    className="w-full h-48 object-cover rounded-lg border border-border bg-secondary"
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
                {(order.status === "delivered" || order.status === "cancelled") && (
                  <div className="flex-1" />
                )}

                {/* Override status */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  {showStatusMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[150px]">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPanelLayout>
  );
};

export default PanelOrdersPage;
