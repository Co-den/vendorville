import { create } from "zustand";

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
  renewsAt: string | null;
  isProcessing: PlanId | null;
  setPlan: (planId: PlanId) => void;
  setProcessing: (planId: PlanId | null) => void;
}
export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plan: "starter", // every vendor starts on the entry-level paid plan
  renewsAt: null,
  isProcessing: null,

  setPlan: (planId) =>
    set({
      plan: planId,
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }),

  setProcessing: (planId) => set({ isProcessing: planId }),
}));
