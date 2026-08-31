import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { create } from "zustand";

interface Admin {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface DashboardStats {
  [key: string]: unknown;
}

interface Business {
  id: number;
  [key: string]: unknown;
}

interface ChatThread {
  id: number;
  [key: string]: unknown;
}

interface ChatMessage {
  id: number;
  threadId: number;
  senderType: "vendor" | "admin";
  senderId: number;
  message: string;
  createdAt: string;
  [key: string]: unknown;
}

interface User {
  id: number;
  [key: string]: unknown;
}

interface Report {
  id: number;
  [key: string]: unknown;
}

interface Transaction {
  id: number;
  [key: string]: unknown;
}

interface Settings {
  [key: string]: unknown;
}

interface BusinessFilters {
  [key: string]: string | number | boolean | undefined;
}

interface UserFilters {
  [key: string]: string | number | boolean | undefined;
}

interface ReportFilters {
  [key: string]: string | number | boolean | undefined;
}

interface TransactionFilters {
  [key: string]: string | number | boolean | undefined;
}

interface LoginResponse {
  token: string;
  admin: Admin;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not defined. Admin API requests may fail.",
  );
}

const adminApi: AxiosInstance = axios.create({
  baseURL: API_URL,
});

adminApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

adminApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
      }
    }

    return Promise.reject(error);
  },
);

interface AdminAuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  getStats: () => Promise<DashboardStats>;

  getPendingBusinesses: () => Promise<Business[]>;
  approveBusiness: (businessId: number | string) => Promise<unknown>;
  rejectBusiness: (
    businessId: number | string,
    reason: string,
  ) => Promise<unknown>;

  getBusinesses: (filters?: BusinessFilters) => Promise<Business[]>;
  getBusinessById: (businessId: number | string) => Promise<Business>;

  getChatThreads: () => Promise<ChatThread[]>;
  getChatMessages: (threadId: number | string) => Promise<ChatMessage[]>;
  sendChatMessage: (
    threadId: number | string,
    message: string,
  ) => Promise<ChatMessage>;

  getUsers: (filters?: UserFilters) => Promise<User[]>;
  suspendUser: (userId: number | string, reason: string) => Promise<unknown>;
  activateUser: (userId: number | string) => Promise<unknown>;

  getReports: (filters?: ReportFilters) => Promise<Report[]>;
  resolveReport: (
    reportId: number | string,
    action: string,
    details?: string,
  ) => Promise<unknown>;

  getTransactions: (filters?: TransactionFilters) => Promise<Transaction[]>;

  getSettings: () => Promise<Settings>;
  updateSettings: (settings: Settings) => Promise<unknown>;
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<void> => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await adminApi.post<LoginResponse>("/admin/login", {
        email,
        password,
      });

      const { token, admin } = response.data;

      if (!token) {
        throw new Error(
          "Login succeeded but no authentication token was returned.",
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("admin_token", token);
      }

      set({
        admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Login failed");

      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }

    set({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await adminApi.get<{
      stats: DashboardStats;
    }>("/admin/stats");

    return response.data.stats;
  },

  getPendingBusinesses: async (): Promise<Business[]> => {
    const response = await adminApi.get<{
      businesses: Business[];
    }>("/admin/pending");

    return response.data.businesses;
  },

  approveBusiness: async (businessId: number | string): Promise<unknown> => {
    const response = await adminApi.post(`/admin/approve/${businessId}`);

    return response.data;
  },

  rejectBusiness: async (
    businessId: number | string,
    reason: string,
  ): Promise<unknown> => {
    const response = await adminApi.post(`/admin/reject/${businessId}`, {
      reason,
    });

    return response.data;
  },

  getBusinesses: async (filters: BusinessFilters = {}): Promise<Business[]> => {
    const response = await adminApi.get<{
      businesses: Business[];
    }>("/admin/businesses", {
      params: filters,
    });

    return response.data.businesses;
  },

  getBusinessById: async (businessId: number | string): Promise<Business> => {
    const response = await adminApi.get<{
      business: Business;
    }>(`/admin/businesses/${businessId}`);

    return response.data.business;
  },

  getChatThreads: async (): Promise<ChatThread[]> => {
    const response = await adminApi.get<{
      threads: ChatThread[];
    }>("/admin/chat/threads");

    return response.data.threads;
  },

  getChatMessages: async (
    threadId: number | string,
  ): Promise<ChatMessage[]> => {
    const response = await adminApi.get<{
      messages: ChatMessage[];
    }>(`/admin/chat/threads/${threadId}/messages`);

    return response.data.messages;
  },

  sendChatMessage: async (
    threadId: number | string,
    message: string,
  ): Promise<ChatMessage> => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      throw new Error("Message cannot be empty.");
    }

    const response = await adminApi.post<{
      message: ChatMessage;
    }>(`/admin/chat/threads/${threadId}/messages`, {
      message: trimmedMessage,
    });

    return response.data.message;
  },

  getUsers: async (filters: UserFilters = {}): Promise<User[]> => {
    const response = await adminApi.get<{
      users: User[];
    }>("/admin/users", {
      params: filters,
    });

    return response.data.users;
  },

  suspendUser: async (
    userId: number | string,
    reason: string,
  ): Promise<unknown> => {
    const response = await adminApi.post(`/admin/users/${userId}/suspend`, {
      reason,
    });

    return response.data;
  },

  activateUser: async (userId: number | string): Promise<unknown> => {
    const response = await adminApi.post(`/admin/users/${userId}/activate`);

    return response.data;
  },

  getReports: async (filters: ReportFilters = {}): Promise<Report[]> => {
    const response = await adminApi.get<{
      reports: Report[];
    }>("/admin/reports", {
      params: filters,
    });

    return response.data.reports;
  },

  resolveReport: async (
    reportId: number | string,
    action: string,
    details?: string,
  ): Promise<unknown> => {
    const response = await adminApi.post(`/admin/reports/${reportId}`, {
      action,
      details,
    });

    return response.data;
  },

  getTransactions: async (
    filters: TransactionFilters = {},
  ): Promise<Transaction[]> => {
    const response = await adminApi.get<{
      transactions: Transaction[];
    }>("/admin/transactions", {
      params: filters,
    });

    return response.data.transactions;
  },

  getSettings: async (): Promise<Settings> => {
    const response = await adminApi.get<{
      settings: Settings;
    }>("/admin/settings");

    return response.data.settings;
  },

  updateSettings: async (settings: Settings): Promise<unknown> => {
    const response = await adminApi.put("/admin/settings", settings);

    return response.data;
  },
}));

export { adminApi };
