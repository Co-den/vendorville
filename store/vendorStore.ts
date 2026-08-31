import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { create } from "zustand";

interface Subscription {
  id: number;
  userId: number;
  plan: "starter" | "professional" | "enterprise";
  status: "trial" | "active" | "expired" | "cancelled";
  trialEndsAt: string | null;
  renewsAt: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface Staff {
  id: number;
  businessId: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  [key: string]: unknown;
}

interface GiftCard {
  id: number;
  businessId: number;
  code: string;
  initialValue: number;
  remainingValue: number;
  isActive: boolean;
  createdAt: string;
}

interface Rider {
  id: number;
  businessId: number;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface Zone {
  id: number;
  businessId: number;
  name: string;
  fee: number;
  createdAt: string;
}

interface VendorState {
  // Subscription
  subscription: Subscription | null;
  getSubscription: (userId: number | string) => Promise<Subscription>;

  // Staff
  staff: Staff[];
  getStaff: (businessId: number | string) => Promise<Staff[]>;
  inviteStaff: (
    businessId: number | string,
    data: {
      name: string;
      email: string;
      role?: string;
      tempPassword: string;
    },
  ) => Promise<Staff>;
  removeStaff: (businessId: number | string, staffId: number) => Promise<void>;

  // Gift Cards
  giftCards: GiftCard[];
  getGiftCards: (businessId: number | string) => Promise<GiftCard[]>;
  issueGiftCard: (
    businessId: number | string,
    value: number,
  ) => Promise<GiftCard>;

  // Riders
  riders: Rider[];
  getRiders: (businessId: number | string) => Promise<Rider[]>;
  addRider: (
    businessId: number | string,
    data: { name: string; phone: string },
  ) => Promise<Rider>;

  // Zones
  zones: Zone[];
  getZones: (businessId: number | string) => Promise<Zone[]>;
  addZone: (
    businessId: number | string,
    data: { name: string; fee: number },
  ) => Promise<Zone>;
  removeZone: (businessId: number | string, zoneId: number) => Promise<void>;

  // Password
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ message: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const vendorApi: AxiosInstance = axios.create({
  baseURL: API_URL,
});

vendorApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

vendorApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  },
);

export const useVendorStore = create<VendorState>((set) => ({
  subscription: null,
  staff: [],
  giftCards: [],
  riders: [],
  zones: [],

  // Subscription
  getSubscription: async (): Promise<Subscription> => {
    const response = await vendorApi.get<{
      subscription: Subscription;
    }>("/subscription");
    const subscription = response.data.subscription;
    set({ subscription });
    return subscription;
  },

  // Staff
  getStaff: async (businessId: number | string): Promise<Staff[]> => {
    const response = await vendorApi.get<{
      staff: Staff[];
    }>(`/businesses/${businessId}/staff`);
    const staff = response.data.staff;
    set({ staff });
    return staff;
  },

  inviteStaff: async (
    businessId: number | string,
    data: {
      name: string;
      email: string;
      role?: string;
      tempPassword: string;
    },
  ): Promise<Staff> => {
    try {
      const response = await vendorApi.post<{
        staff: Staff;
      }>(`/businesses/${businessId}/staff`, data);

      const newStaff = response.data.staff;
      set((state) => ({
        staff: [...state.staff, newStaff],
      }));
      return newStaff;
    } catch (error) {
      throw error;
    }
  },

  removeStaff: async (
    businessId: number | string,
    staffId: number,
  ): Promise<void> => {
    try {
      await vendorApi.delete(`/businesses/${businessId}/staff/${staffId}`);

      set((state) => ({
        staff: state.staff.filter((s) => s.id !== staffId),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Gift Cards
  getGiftCards: async (businessId: number | string): Promise<GiftCard[]> => {
    const response = await vendorApi.get<{
      cards: GiftCard[];
    }>(`/businesses/${businessId}/gift-cards`);
    const giftCards = response.data.cards;
    set({ giftCards });
    return giftCards;
  },

  issueGiftCard: async (
    businessId: number | string,
    value: number,
  ): Promise<GiftCard> => {
    try {
      const response = await vendorApi.post<{
        card: GiftCard;
      }>(`/businesses/${businessId}/gift-cards`, { value });

      const giftCard = response.data.card;
      set((state) => ({
        giftCards: [...state.giftCards, giftCard],
      }));
      return giftCard;
    } catch (error) {
      throw error;
    }
  },

  // Riders
  getRiders: async (businessId: number | string): Promise<Rider[]> => {
    const response = await vendorApi.get<{
      riders: Rider[];
    }>(`/businesses/${businessId}/riders`);
    const riders = response.data.riders;
    set({ riders });
    return riders;
  },

  addRider: async (
    businessId: number | string,
    data: { name: string; phone: string },
  ): Promise<Rider> => {
    try {
      const response = await vendorApi.post<{
        rider: Rider;
      }>(`/businesses/${businessId}/riders`, data);

      const rider = response.data.rider;
      set((state) => ({
        riders: [...state.riders, rider],
      }));
      return rider;
    } catch (error) {
      throw error;
    }
  },

  // Zones
  getZones: async (businessId: number | string): Promise<Zone[]> => {
    const response = await vendorApi.get<{
      zones: Zone[];
    }>(`/businesses/${businessId}/delivery-zones`);
    const zones = response.data.zones;
    set({ zones });
    return zones;
  },

  addZone: async (
    businessId: number | string,
    data: { name: string; fee: number },
  ): Promise<Zone> => {
    try {
      const response = await vendorApi.post<{
        zone: Zone;
      }>(`/businesses/${businessId}/delivery-zones`, data);

      const zone = response.data.zone;
      set((state) => ({
        zones: [...state.zones, zone],
      }));
      return zone;
    } catch (error) {
      throw error;
    }
  },

  removeZone: async (
    businessId: number | string,
    zoneId: number,
  ): Promise<void> => {
    try {
      await vendorApi.delete(
        `/businesses/${businessId}/delivery-zones/${zoneId}`,
      );

      set((state) => ({
        zones: state.zones.filter((z) => z.id !== zoneId),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Password
  updatePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    try {
      const response = await vendorApi.post<{
        message: string;
      }>("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));

export { vendorApi };
