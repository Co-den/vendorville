
import { create } from "zustand";
import api from "./axiosInstance";

export interface Business {
  id: number;
  userId: number;
  name: string;
  slug: string;
  shortName: string | null;
  logoUrl: string | null;
  whatsappNumber: string | null;
  businessEmail: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  telegram: string | null;
  startedDate: string | null;
  visibility: string;
  address: string;
  description: string | null;
  isVerified: boolean;
  premisesImages: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateBusinessError extends Error {
  code?: string;
}

interface BusinessState {
  businesses: Business[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchBusinesses: () => Promise<void>;
  createBusiness: (formData: FormData) => Promise<Business>;
  deleteBusiness: (businessId: number) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchBusinesses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/businesses`);
      set({ businesses: response.data.businesses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading businesses",
        isLoading: false,
      });
    }
  },

  createBusiness: async (formData) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await api.post(`/businesses`, formData);
      const newBusiness: Business = response.data.business;
      set({
        businesses: [...get().businesses, newBusiness],
        isSubmitting: false,
      });
      return newBusiness;
    } catch (error: any) {
      const errData = error.response?.data;
      set({
        error: errData?.message || "Error creating business",
        isSubmitting: false,
      });
      const err: CreateBusinessError = new Error(errData?.message || "Error creating business");
      err.code = errData?.code;
      throw err;
    }
  },

  deleteBusiness: async (businessId) => {
    try {
      await api.delete(`/businesses/${businessId}`);
      set({ businesses: get().businesses.filter((b) => b.id !== businessId) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error deleting business" });
      throw error;
    }
  },
}));