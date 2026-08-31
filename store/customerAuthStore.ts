import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const customerApi = axios.create({ baseURL: API_URL });

customerApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("customer_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface CustomerAuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;
  error: string | null;

  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
  customer: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.post("/store/customer/register", data);
      localStorage.setItem("customer_token", response.data.token);
      set({
        customer: response.data.customer,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerApi.post("/store/customer/login", {
        email,
        password,
      });
      localStorage.setItem("customer_token", response.data.token);
      set({
        customer: response.data.customer,
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

  logout: async () => {
    try {
      await customerApi.post("/store/customer/logout");
    } catch {}
    localStorage.removeItem("customer_token");
    set({ customer: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await customerApi.get("/store/customer/check-auth");
      set({
        customer: response.data.customer,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      localStorage.removeItem("customer_token");
      set({ customer: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export { customerApi };
