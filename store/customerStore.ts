import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Customer {
  name: string;
  phone: string | null;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  notes: string | null;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;

  fetchCustomers: (businessId: number) => Promise<void>;
  saveNote: (
    businessId: number,
    phone: string,
    name: string,
    notes: string,
  ) => Promise<void>;
  clearCustomers: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async (businessId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/businesses/${businessId}/customers`,
      );
      set({ customers: response.data.customers, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading customers",
        isLoading: false,
      });
    }
  },

  saveNote: async (businessId, phone, name, notes) => {
    try {
      await axios.post(`${API_URL}/businesses/${businessId}/customers/notes`, {
        phone,
        name,
        notes,
      });
      set({
        customers: get().customers.map((c) =>
          c.phone === phone ? { ...c, notes } : c,
        ),
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error saving note" });
      throw error;
    }
  },

  clearCustomers: () => set({ customers: [] }),
}));
