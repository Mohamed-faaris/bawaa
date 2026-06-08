import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  ImageIcon,
  Pencil,
  CheckCircle2,
  Truck,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Textarea } from "@bawaa/ui/textarea";
import { toast } from "sonner";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

type OrderStatus =
  | "ordered"
  | "processing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

type PrescriptionItem = {
  name?: string;
  quantity?: number;
  note?: string;
};

const statusColors: Record<string, string> = {
  ordered: "bg-warning/15 text-warning",
  processing: "bg-info/15 text-info",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-info/15 text-info",
  delivered: "bg-success/15 text-success",
};

const allStatuses: { value: OrderStatus; label: string }[] = [
  { value: "ordered", label: "Ordered" },
  { value: "processing", label: "Processing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
];

const PanelOrderDetailPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderid");
  const navigate = useNavigate();
  const orders = useQuery(api.admin.listOrders) ?? [];
  const updateStatus = useMutation(api.admin.updateOrderStatus);
  const getImageUrl = useAction(api.storage.getImageUrl);

  const order = orders.find((o: any) => o._id === orderId);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditingPrescription, setIsEditingPrescription] = useState(false);
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [editedItems, setEditedItems] = useState<PrescriptionItem[]>([]);

  useEffect(() => {
    if (!order) return;
    setEditedNotes(order.prescription?.notes ?? "");
    setEditedItems(
      (order.prescription?.items ?? []).map((item: any) => ({ ...item })),
    );
    setIsEditingPrescription(false);
  }, [order]);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      if (!order) return;

      if (order.prescription?.storageId) {
        try {
          const url = await getImageUrl({
            storageId: order.prescription.storageId,
          });
          if (!cancelled) setImageUrl(url ?? null);
          return;
        } catch (error) {
          console.error("Failed to resolve storage image URL", error);
        }
      }

      const fallbackImage =
        order.prescription?.imageUrl &&
        !order.prescription.imageUrl.startsWith("blob:")
          ? order.prescription.imageUrl
          : null;
      if (!cancelled) setImageUrl(fallbackImage);
    };

    void loadImage();
    return () => { cancelled = true; };
  }, [getImageUrl, order]);

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No order specified</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/panel/orders")}
          className="mt-4"
        >
          Go to orders
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Order not found</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/panel/orders")}
          className="mt-4"
        >
          Go back
        </Button>
      </div>
    );
  }

  const prescriptionItems = order.prescription?.items ?? [];

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateStatus({ orderId: order._id, status });
      setShowStatusMenu(false);
      toast.success(`Status updated to ${status.replaceAll("_", " ")}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const updateItemField = (
    index: number,
    field: keyof PrescriptionItem,
    value: string,
  ) => {
    setEditedItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "quantity"
                  ? value === ""
                    ? undefined
                    : Number(value)
                  : value || undefined,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setEditedItems((current) => [
      ...current,
      { name: undefined, quantity: 1, note: undefined },
    ]);
  };

  const removeItem = (index: number) => {
    setEditedItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleSavePrescription = async () => {
    setIsSavingPrescription(true);
    try {
      await updateStatus({
        orderId: order._id,
        status: order.status,
        prescription: {
          imageUrl:
            order.prescription?.imageUrl &&
            !order.prescription.imageUrl.startsWith("blob:")
              ? order.prescription.imageUrl
              : undefined,
          storageId: order.prescription?.storageId,
          notes: editedNotes || undefined,
          items: editedItems.map((item) => ({
            name: item.name || undefined,
            quantity: item.quantity,
            note: item.note || undefined,
          })),
        },
      });
      setIsEditingPrescription(false);
      toast.success("Prescription details updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save prescription details");
    } finally {
      setIsSavingPrescription(false);
    }
  };

  function formatOrderCode(id: string) {
    return `ORD-${id.slice(-4).toUpperCase()}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/panel/orders")}
          className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground">
              {formatOrderCode(order._id)}
            </h1>
            {imageUrl && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-1">
                <ImageIcon size={12} /> Rx
              </span>
            )}
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || ""}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: customer + image */}
        <div className="lg:col-span-1 space-y-4">
          {/* Customer Card */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
              Customer
            </p>
            <p className="text-lg font-bold text-foreground">
              {order.account?.name || "Unknown customer"}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.profile?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {order.account?.phone || "Phone not available"}
            </p>
            <a
              href={`tel:${(order.account?.phone || "").replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold w-full hover:bg-primary/90 transition-colors"
            >
              <Phone size={16} />
              Call Customer
            </a>
          </div>

          {/* Prescription Image */}
          {imageUrl && (
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Prescription Image
              </p>
              <img
                src={imageUrl}
                alt="Prescription"
                className="w-full h-48 object-cover rounded-lg border border-border bg-secondary"
              />
            </div>
          )}
        </div>

        {/* Right column: items + notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prescription Items */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Items{" "}
                {(isEditingPrescription ? editedItems : prescriptionItems)
                  .length > 0 &&
                  `(${(isEditingPrescription ? editedItems : prescriptionItems).length})`}
              </p>
              <button
                onClick={() => setIsEditingPrescription((current) => !current)}
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
              >
                <Pencil size={12} />{" "}
                {isEditingPrescription ? "Cancel" : "Edit"}
              </button>
            </div>

            {!isEditingPrescription && prescriptionItems.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No structured prescription items were saved for this order yet.
              </p>
            )}

            {!isEditingPrescription && prescriptionItems.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {prescriptionItems.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-secondary/30">
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {item.name || `Item ${idx + 1}`}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {item.quantity ?? 1}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {item.note || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {isEditingPrescription && (
              <div className="space-y-3">
                {editedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-secondary/50 p-4 space-y-3 border border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Item {idx + 1}
                      </p>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-destructive p-1 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Medicine name
                        </p>
                        <Input
                          value={item.name ?? ""}
                          onChange={(event) =>
                            updateItemField(idx, "name", event.target.value)
                          }
                          placeholder="Medicine name"
                          className="h-9 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Quantity
                        </p>
                        <Input
                          value={item.quantity ?? ""}
                          onChange={(event) =>
                            updateItemField(idx, "quantity", event.target.value)
                          }
                          placeholder="Qty"
                          type="number"
                          min="1"
                          className="h-9 text-sm rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Note</p>
                      <Input
                        value={item.note ?? ""}
                        onChange={(event) =>
                          updateItemField(idx, "note", event.target.value)
                        }
                        placeholder="Note"
                        className="h-9 text-sm rounded-lg"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full rounded-lg gap-2"
                >
                  <Plus size={14} />
                  Add Item
                </Button>
              </div>
            )}

            {/* Notes */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Notes
              </p>
              {isEditingPrescription ? (
                <Textarea
                  value={editedNotes}
                  onChange={(event) => setEditedNotes(event.target.value)}
                  placeholder="Add admin notes for this prescription"
                  className="rounded-lg bg-card border-border min-h-[96px] resize-none"
                />
              ) : order.prescription?.notes ? (
                <p className="text-sm text-foreground">
                  {order.prescription.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes saved yet.
                </p>
              )}
            </div>

            {isEditingPrescription && (
              <Button
                onClick={() => void handleSavePrescription()}
                disabled={isSavingPrescription}
                className="w-full mt-4 rounded-lg gap-2"
              >
                <Save size={14} />
                {isSavingPrescription ? "Saving..." : "Save Prescription Details"}
              </Button>
            )}
          </div>

          {/* Status Actions */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Status Actions
            </p>
            <div className="flex items-center gap-3">
              {order.status === "ordered" && (
                <Button
                  onClick={() => handleStatusChange("processing")}
                  className="rounded-lg h-11 gap-1.5"
                >
                  <CheckCircle2 size={16} /> Approve Order
                </Button>
              )}
              {order.status === "processing" && (
                <Button
                  onClick={() => handleStatusChange("ready")}
                  className="rounded-lg h-11 bg-accent hover:bg-accent/90 gap-1.5"
                >
                  <Truck size={16} /> Mark Ready
                </Button>
              )}
              {order.status === "ready" && (
                <Button
                  onClick={() => handleStatusChange("out_for_delivery")}
                  className="rounded-lg h-11 gap-1.5"
                >
                  <Truck size={16} /> Start Delivery
                </Button>
              )}
              {order.status === "out_for_delivery" && (
                <Button
                  onClick={() => handleStatusChange("delivered")}
                  className="rounded-lg h-11 gap-1.5"
                >
                  <CheckCircle2 size={16} /> Mark Delivered
                </Button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  <Pencil size={16} />
                </button>
                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[160px]"
                  >
                    {allStatuses
                      .filter((s) => s.value !== order.status)
                      .map((s) => (
                        <button
                          key={s.value}
                          onClick={() => void handleStatusChange(s.value)}
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
        </div>
      </div>
    </motion.div>
  );
};

export default PanelOrderDetailPage;
