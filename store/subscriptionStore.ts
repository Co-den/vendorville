import { create } from "zustand";
import api from "./axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const plans = {
  starter: {
    id: "starter",
    name: "Starter",
    tagline: "Suitable for vendors",
    price: 5500,
    businessLimit: 1,
    storesPerBusiness: 1,
    features: [
      "1 Business, 1 Stall/Front",
      "Up to 200 POS order items/month",
      "Up to 50 orders per customer",
      "Standard POS & Inventory",
      "Up to 50 Customers per store",
      "5 Shelf/Rack Compartments",
      "1 Staff per Store",
      "Email & WhatsApp Sharing",
    ],
  },
  professional: {
    id: "professional",
    name: "Professional",
    tagline: "Built for growing vendors",
    price: 10500,
    businessLimit: 2,
    storesPerBusiness: 2,
    popular: true,
    features: [
      "2 Businesses, 2 Stores per Brand",
      "Up to 400 POS order items/month",
      "Up to 100 orders per customer",
      "Gift Card & Loyalty Points",
      "Up to 120 Customers per store",
      "15 Shelf/Rack Compartments",
      "3 Staff per Store",
      "Email, SMS & WhatsApp Alerts",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Suite",
    tagline: "For enterprise-level vendors",
    price: 15500,
    businessLimit: Infinity,
    storesPerBusiness: Infinity,
    features: [
      "Unlimited Businesses & Stalls",
      "Unlimited POS order items",
      "Unlimited orders per store",
      "Unlimited Staff per Store",
      "Unlimited Shelf/Rack Compartments",
      "AI-Powered Order Creation",
      "Dispatch Rider Feature",
      "Email, SMS & WhatsApp Alerts",
    ],
  },
};

export type PlanId = keyof typeof plans;

interface SubscriptionState {
  plan: PlanId;
  status: "active" | "expired" | "cancelled";
  renewsAt: string | null;
  limit: number;
  isLoading: boolean;
  isProcessing: PlanId | null;
  error: string | null;

  fetchSubscription: () => Promise<void>;
  confirmUpgrade: (planId: PlanId, reference: string) => Promise<void>;
  setProcessing: (planId: PlanId | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plan: "starter",
  status: "active",
  renewsAt: null,
  limit: 1,
  isLoading: false,
  isProcessing: null,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/subscription`);
      const sub = response.data.subscription;
      set({
        plan: sub.plan,
        status: sub.status,
        renewsAt: sub.renewsAt,
        limit: sub.limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading subscription",
        isLoading: false,
      });
    }
  },

  // Called after Paystack's popup reports success — sends the reference
  // to the backend, which independently verifies the payment before
  // persisting the plan change. Never trust the client-side callback alone.
  confirmUpgrade: async (planId, reference) => {
    set({ isProcessing: planId, error: null });
    try {
      const response = await api.post(`/subscription/upgrade`, {
        plan: planId,
        reference,
      });
      const sub = response.data.subscription;
      set({
        plan: sub.plan,
        status: sub.status,
        renewsAt: sub.renewsAt,
        limit: sub.limit,
        isProcessing: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error confirming upgrade",
        isProcessing: null,
      });
      throw error;
    }
  },

  setProcessing: (planId) => set({ isProcessing: planId }),
}));
