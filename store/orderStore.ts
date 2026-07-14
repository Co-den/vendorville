import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OrderItem {
  productId: number | null;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  businessId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  totalAmount: number;
  paymentMethod: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod: string;
  notes?: string;
  items: { productId: number; quantity: number }[];
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchOrders: (businessId: number) => Promise<void>;
  createOrder: (businessId: number, payload: CreateOrderPayload) => Promise<Order>;
  updateOrderStatus: (businessId: number, orderId: number, status: string) => Promise<void>;
  deleteOrder: (businessId: number, orderId: number) => Promise<void>;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchOrders: async (businessId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/businesses/${businessId}/orders`);
      set({ orders: response.data.orders, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading orders",
        isLoading: false,
      });
    }
  },

  createOrder: async (businessId, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/businesses/${businessId}/orders`, payload);
      const newOrder: Order = response.data.order;
      set({ orders: [newOrder, ...get().orders], isSubmitting: false });
      return newOrder;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error creating order",
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateOrderStatus: async (businessId, orderId, status) => {
    try {
      await axios.patch(`${API_URL}/businesses/${businessId}/orders/${orderId}/status`, { status });
      set({
        orders: get().orders.map((o) =>
          o.id === orderId ? { ...o, status: status as Order["status"] } : o
        ),
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error updating order status" });
      throw error;
    }
  },

  deleteOrder: async (businessId, orderId) => {
    try {
      await axios.delete(`${API_URL}/businesses/${businessId}/orders/${orderId}`);
      set({ orders: get().orders.filter((o) => o.id !== orderId) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error deleting order" });
      throw error;
    }
  },

  clearOrders: () => set({ orders: [] }),
}));