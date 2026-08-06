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
}

interface DirectoryState {
  vendors: DirectoryVendor[];
  isLoading: boolean;
  error: string | null;
  fetchDirectory: (search?: string, category?: string) => Promise<void>;
}

export async function fetchDirectory(
  search?: string,
  category?: string,
  limit?: number,
) {
  try {
    const response = await api.get(`/store/directory`, {
      params: { search, category },
    });

    const businesses = Array.isArray(response.data?.businesses)
      ? response.data.businesses
      : [];

    return typeof limit === "number" ? businesses.slice(0, limit) : businesses;
  } catch {
    return [];
  }
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  vendors: [],
  isLoading: false,
  error: null,

  fetchDirectory: async (search, category) => {
    set({ isLoading: true, error: null });
    try {
      const businesses = await fetchDirectory(search, category);
      set({ vendors: businesses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Could not load vendors",
        isLoading: false,
      });
    }
  },
}));