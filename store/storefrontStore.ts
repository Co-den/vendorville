import { create } from "zustand";
import api from "./axiosInstance";

export interface StorefrontProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  imageUrl: string | null;
  price: number;
  stock: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  fee: number;
}

export interface StorefrontBusiness {
  id: number;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  description: string | null;
  whatsappNumber: string | null;
  businessEmail: string | null;
  instagram: string | null;
  tiktok: string | null;
  address: string;
  premisesImages: string[];
  availableDays: string[];
  isOpenToday: boolean;
  deliveryZones: DeliveryZone[];
}

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryZoneId: number;
  paymentMethod: "paystack" | "pay_on_delivery";
  items: { productId: number; quantity: number }[];
}

interface StorefrontState {
  business: StorefrontBusiness | null;
  products: StorefrontProduct[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchStorefront: (slug: string) => Promise<void>;
  createOrder: (slug: string, payload: CheckoutPayload) => Promise<any>;
  verifyPayment: (slug: string, reference: string) => Promise<void>;
}

export const useStorefrontStore = create<StorefrontState>((set) => ({
  business: null,
  products: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchStorefront: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/store/${slug}`);
      set({
        business: {
          ...response.data.business,
          deliveryZones: response.data.deliveryZones || [],
        },
        products: response.data.products,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Store not found",
        isLoading: false,
      });
    }
  },

  createOrder: async (slug, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await api.post(`/store/${slug}/orders`, payload, {
        withCredentials: true,
      });
      set({ isSubmitting: false });
      return response.data.order;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Could not place order",
        isSubmitting: false,
      });
      throw error;
    }
  },

  verifyPayment: async (slug, reference) => {
    await api.post(`/store/${slug}/verify-payment`, { reference });
  },
}));
