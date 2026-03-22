import { useMutation, useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import type { Doc, Id } from "@bawaa/convex-db/convex/_generated/dataModel";

export type OrderStatus =
  | "ordered"
  | "processing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

export type PrescriptionItem = {
  name?: string;
  quantity?: number;
  note?: string;
};

export type AdminOrder = Doc<"orders"> & {
  profile: Doc<"profiles"> | null;
  account: Doc<"accounts"> | null;
};

export function formatOrderCode(orderId: string) {
  return `ORD-${orderId.slice(-4).toUpperCase()}`;
}

export function useAdminOrders() {
  const orders = useQuery(api.admin.listOrders) ?? [];
  const updateStatus = useMutation(api.admin.updateOrderStatus);

  return {
    orders: orders as AdminOrder[],
    updateStatus: (
      orderId: Id<"orders">,
      status: OrderStatus,
      prescription?: {
        imageUrl?: string;
        storageId?: string;
        notes?: string;
        items?: PrescriptionItem[];
      },
    ) => updateStatus({ orderId, status, prescription }),
  };
}
