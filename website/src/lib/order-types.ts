// Cart, order, and checkout types

export interface CartItem {
  /** Product hex id */
  productId: string;
  slug: string;
  name: string;
  image?: string;
  /** Whole PKR */
  unitPrice: number;
  qty: number;
  /** Chosen variant options, e.g. { Finish: "Walnut", Size: "6-seater" } */
  options: Record<string, string>;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "in_production"
  | "ready"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "in_production",
  "ready",
  "delivered",
  "cancelled",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  in_production: "In production",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  city?: string;
  note?: string;
}

export interface OrderEvent {
  status: OrderStatus;
  at: Date;
  note?: string;
  by?: string;
}

export interface Order {
  _id?: import("mongodb").ObjectId;
  /** Human-readable order number, e.g. CRM-48211 */
  number: string;
  items: CartItem[];
  total: number;
  customer: OrderCustomer;
  status: OrderStatus;
  events: OrderEvent[];
  createdAt: Date;
  updatedAt: Date;
}
