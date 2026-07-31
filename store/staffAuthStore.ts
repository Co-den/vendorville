import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const staffApi = axios.create({ baseURL: API_URL });

staffApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("staff_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Staff {
  id: number;
  name: string;
  email: string;
  role: "staff" | "manager";
  businessId: number;
  businessName: string;
}

interface StaffAuthState {
  staff: Staff | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useStaffAuthStore = create<StaffAuthState>((set) => ({
  staff: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await staffApi.post("/staff-auth/login", {
        email,
        password,
      });
      localStorage.setItem("staff_token", response.data.token);
      set({
        staff: response.data.staff,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("staff_token");
    set({ staff: null, isAuthenticated: false });
  },
}));

export { staffApi };

