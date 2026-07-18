import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StorefrontProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  imageUrl: string | null;
  price: number;
  stock: number;
}

export interface StorefrontBusiness {
  availableDays: any;
  businessEmail: import("react").JSX.Element;
  instagram: any;
  tiktok: any;
  isOpenToday: any;
  id: number;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  description: string | null;
  whatsappNumber: string | null;
  address: string;
  premisesImages: string[];
}

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryFee?: number;
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
      const response = await axios.get(`${API_URL}/store/${slug}`);
      set({
        business: response.data.business,
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
      const response = await axios.post(
        `${API_URL}/store/${slug}/orders`,
        payload,
        { withCredentials: true },
      );
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
    await axios.post(`${API_URL}/store/${slug}/verify-payment`, { reference });
  },
}));
