import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useAction } from "convex/react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Textarea } from "@bawaa/ui/textarea";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import {
  formatOrderCode,
  useAdminOrders,
  type OrderStatus,
  type PrescriptionItem,
} from "@/hooks/useAdminOrders";

const AdminMobileOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateStatus } = useAdminOrders();
  const getImageUrl = useAction(api.storage.getImageUrl);

  const order = orders.find((o) => o._id === orderId);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditingPrescription, setIsEditingPrescription] = useState(false);
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [editedItems, setEditedItems] = useState<PrescriptionItem[]>([]);

  const allStatuses: { value: OrderStatus; label: string }[] = [
    { value: "ordered", label: "Ordered" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
    { value: "out_for_delivery", label: "Out for delivery" },
    { value: "delivered", label: "Delivered" },
  ];

  useEffect(() => {
    if (!order) {
      return;
    }
    setEditedNotes(order.prescription?.notes ?? "");
    setEditedItems(
      (order.prescription?.items ?? []).map((item) => ({ ...item })),
    );
    setIsEditingPrescription(false);
  }, [order]);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      if (!order) {
        return;
      }

      if (order.prescription?.storageId) {
        try {
          const url = await getImageUrl({
            storageId: order.prescription.storageId,
          });
          if (!cancelled) {
            setImageUrl(url ?? null);
          }
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
      if (!cancelled) {
        setImageUrl(fallbackImage);
      }
    };

    void loadImage();

    return () => {
      cancelled = true;
    };
  }, [getImageUrl, order]);

  if (!order) {
    return (
      <PageTransition>
        <div className="app-container screen-padding text-center pt-20">
          <p className="text-muted-foreground">Order not found</p>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin-mobile/orders")}
            className="mt-4"
          >
            Go back
          </Button>
        </div>
      </PageTransition>
    );
  }

  const prescriptionItems = order.prescription?.items ?? [];

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateStatus(order._id, status);
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
      await updateStatus(order._id, order.status, {
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

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/admin-mobile/orders")}
            className="p-1.5 rounded-lg bg-secondary text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-foreground">
                {formatOrderCode(order._id)}
              </h1>
              {imageUrl && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground flex items-center gap-0.5">
                  <ImageIcon size={10} /> Rx
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="glass-card p-4 mb-3">
          <p className="text-sm font-semibold text-foreground">
            {order.account?.name || "Unknown customer"}
          </p>
          <p className="text-xs text-muted-foreground">{order.profile.name}</p>
          <p className="text-xs text-muted-foreground mb-3">
            {order.account?.phone || "Phone not available"}
          </p>
          <a
            href={`tel:${(order.account?.phone || "").replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold w-full"
          >
            <Phone size={16} />
            Call Customer
          </a>
        </div>

        {imageUrl && (
          <div className="glass-card p-4 mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Prescription Image
            </p>
            <img
              src={imageUrl}
              alt="Prescription"
              className="w-full h-48 object-cover rounded-lg border border-border bg-secondary"
            />
          </div>
        )}

        <div className="glass-card p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Items{" "}
              {(isEditingPrescription ? editedItems : prescriptionItems)
                .length > 0 &&
                `(${(isEditingPrescription ? editedItems : prescriptionItems).length})`}
            </p>
            <button
              onClick={() => setIsEditingPrescription((current) => !current)}
              className="text-xs text-primary font-semibold flex items-center gap-1"
            >
              <Pencil size={11} /> {isEditingPrescription ? "Cancel" : "Edit"}
            </button>
          </div>

          {!isEditingPrescription && prescriptionItems.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No structured prescription items were saved for this order yet.
            </p>
          )}

          {!isEditingPrescription && prescriptionItems.length > 0 && (
            <div className="space-y-0">
              {prescriptionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm text-foreground">
                      {item.name || `Item ${idx + 1}`}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity ?? 1}
                    </p>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-muted-foreground max-w-[40%] text-right">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {isEditingPrescription && (
            <div className="space-y-3">
              {editedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-secondary/50 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Item {idx + 1}
                    </p>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-destructive p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <Input
                    value={item.name ?? ""}
                    onChange={(event) =>
                      updateItemField(idx, "name", event.target.value)
                    }
                    placeholder="Medicine name"
                    className="h-9 text-xs rounded-lg"
                  />
                  <Input
                    value={item.quantity ?? ""}
                    onChange={(event) =>
                      updateItemField(idx, "quantity", event.target.value)
                    }
                    placeholder="Quantity"
                    type="number"
                    min="1"
                    className="h-9 text-xs rounded-lg"
                  />
                  <Input
                    value={item.note ?? ""}
                    onChange={(event) =>
                      updateItemField(idx, "note", event.target.value)
                    }
                    placeholder="Note"
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full rounded-xl gap-2 p-2"
              >
                <Plus size={14} />
                Add Item
              </Button>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Notes
            </p>
            {isEditingPrescription ? (
              <Textarea
                value={editedNotes}
                onChange={(event) => setEditedNotes(event.target.value)}
                placeholder="Add admin notes for this prescription"
                className="rounded-xl bg-card border-border min-h-[96px] resize-none"
              />
            ) : order.prescription?.notes ? (
              <p className="text-sm text-foreground">
                {order.prescription.notes}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No notes saved yet.
              </p>
            )}
          </div>

          {isEditingPrescription && (
            <Button
              onClick={() => void handleSavePrescription()}
              disabled={isSavingPrescription}
              className="w-full mt-3 rounded-xl gap-2"
            >
              <Save size={14} />
              {isSavingPrescription ? "Saving..." : "Save Prescription Details"}
            </Button>
          )}
        </div>

        <div className="flex gap-2 mt-4 items-center">
          {order.status === "ordered" && (
            <Button
              onClick={() => handleStatusChange("processing")}
              className="flex-1 rounded-xl h-11 text-sm gap-1.5"
            >
              <CheckCircle2 size={15} /> Approve Order
            </Button>
          )}
          {order.status === "processing" && (
            <Button
              onClick={() => handleStatusChange("ready")}
              className="flex-1 rounded-xl h-11 text-sm bg-accent hover:bg-accent/90 gap-1.5"
            >
              <Truck size={15} /> Mark Ready
            </Button>
          )}
          {order.status === "ready" && (
            <Button
              onClick={() => handleStatusChange("out_for_delivery")}
              className="flex-1 rounded-xl h-11 text-sm gap-1.5"
            >
              <Truck size={15} /> Start Delivery
            </Button>
          )}
          {order.status === "out_for_delivery" && (
            <Button
              onClick={() => handleStatusChange("delivered")}
              className="flex-1 rounded-xl h-11 text-sm gap-1.5"
            >
              <CheckCircle2 size={15} /> Mark Delivered
            </Button>
          )}
          {order.status === "delivered" && <div className="flex-1" />}

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
    </PageTransition>
  );
};

export default AdminMobileOrderDetailPage;
