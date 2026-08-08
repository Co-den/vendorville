import { create } from "zustand";
import api from "./axiosInstance";

export interface DirectoryVendor {
  id: number;
  name: string;
  shortName: string | null;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  address: string;
  productCount: number;
  categories: string[];
  avgRating: number;
  reviewCount: number;
  plan: "starter" | "professional" | "enterprise";
  isAvailable: boolean;
  isOpenToday: boolean;
}

interface DirectoryState {
  vendors: DirectoryVendor[];
  isLoading: boolean;
  error: string | null;
  fetchDirectory: (search?: string, category?: string) => Promise<void>;
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  vendors: [],
  isLoading: false,
  error: null,

  fetchDirectory: async (search, category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/store/directory`, {
        params: { search, category },
      });
      const businesses = Array.isArray(response.data?.businesses)
        ? response.data.businesses
        : [];
      set({ vendors: businesses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Could not load vendors",
        isLoading: false,
      });
    }
  },
}));
