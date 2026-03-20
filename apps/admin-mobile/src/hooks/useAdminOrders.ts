import { useState, useCallback } from "react";

export type OrderStatus = "pending" | "processing" | "ready" | "delivered" | "cancelled";
export type OrderType = "prescription" | "items";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  status: OrderStatus;
  type: OrderType;
  date: string;
  prescriptionUrl?: string;
  items: OrderItem[];
}

const initialOrders: AdminOrder[] = [
  { id: "ORD-2053", customer: "Lakshmi Devi", phone: "+91 77665 54433", status: "pending", type: "prescription", date: "Mar 8, 2026", prescriptionUrl: "/placeholder.svg", items: [] },
  { id: "ORD-2051", customer: "Mohammed Ali", phone: "+91 88776 65544", status: "pending", type: "items", date: "Mar 8, 2026", items: [{ name: "Paracetamol 500mg", qty: 2, price: 30 }, { name: "Amoxicillin 250mg", qty: 1, price: 85 }, { name: "Cough Syrup", qty: 1, price: 120 }, { name: "ORS Sachets", qty: 5, price: 50 }] },
  { id: "ORD-2050", customer: "Sneha Iyer", phone: "+91 87654 32109", status: "processing", type: "prescription", date: "Mar 7, 2026", prescriptionUrl: "/placeholder.svg", items: [{ name: "Vitamin D3", qty: 1, price: 220 }, { name: "Calcium tablets", qty: 2, price: 60 }] },
  { id: "ORD-2048", customer: "Rajesh Kumar", phone: "+91 98765 43210", status: "processing", type: "items", date: "Mar 5, 2026", items: [{ name: "BP Monitor strips", qty: 1, price: 800 }, { name: "Metformin 500mg", qty: 2, price: 45 }, { name: "Glimepiride 1mg", qty: 1, price: 65 }] },
  { id: "ORD-2041", customer: "Priya Kumar", phone: "+91 98765 43210", status: "ready", type: "items", date: "Feb 28, 2026", items: [{ name: "Dolo 650", qty: 3, price: 25 }, { name: "Azithromycin", qty: 1, price: 180 }, { name: "Pantoprazole", qty: 2, price: 90 }, { name: "Cetirizine", qty: 1, price: 35 }, { name: "Multivitamin", qty: 1, price: 350 }] },
  { id: "ORD-2035", customer: "Arun Prasad", phone: "+91 66554 43322", status: "delivered", type: "items", date: "Feb 20, 2026", items: [{ name: "Dolo 650", qty: 3, price: 25 }, { name: "ORS sachets", qty: 5, price: 15 }] },
];

// Simple global state so both pages share the same data
let globalOrders = [...initialOrders];
let listeners: Array<() => void> = [];

const notify = () => listeners.forEach((l) => l());

export function useAdminOrders() {
  const [, setTick] = useState(0);

  const rerender = useCallback(() => setTick((t) => t + 1), []);

  // Subscribe on mount
  useState(() => {
    listeners.push(rerender);
    return () => {
      listeners = listeners.filter((l) => l !== rerender);
    };
  });

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    globalOrders = globalOrders.map((o) => (o.id === id ? { ...o, status } : o));
    notify();
  }, []);

  const addItem = useCallback((orderId: string, item: OrderItem) => {
    globalOrders = globalOrders.map((o) =>
      o.id === orderId ? { ...o, items: [...o.items, item] } : o
    );
    notify();
  }, []);

  const removeItem = useCallback((orderId: string, itemIndex: number) => {
    globalOrders = globalOrders.map((o) =>
      o.id === orderId ? { ...o, items: o.items.filter((_, i) => i !== itemIndex) } : o
    );
    notify();
  }, []);

  return { orders: globalOrders, updateStatus, addItem, removeItem };
}
