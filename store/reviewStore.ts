import { create } from "zustand";
import api from "./axiosInstance";

export interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string | null;
  vendorReply: string | null;
  createdAt: string;
}

export interface ReviewStats {
  total: number;
  avgRating: number;
  breakdown: number[]; // [5-star count, 4-star, 3-star, 2-star, 1-star]
}

interface ReviewState {
  reviews: Review[];
  stats: ReviewStats;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchVendorReviews: (businessId: number) => Promise<void>;
  fetchPublicReviews: (slug: string) => Promise<void>;
  submitReview: (
    slug: string,
    data: {
      orderNumber: string;
      phone: string;
      rating: number;
      comment: string;
    },
  ) => Promise<void>;
  replyToReview: (
    businessId: number,
    reviewId: number,
    reply: string,
  ) => Promise<void>;
  clearMessages: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  stats: { total: 0, avgRating: 0, breakdown: [0, 0, 0, 0, 0] },
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchVendorReviews: async (businessId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/businesses/${businessId}/reviews`);
      set({
        reviews: response.data.reviews,
        stats: response.data.stats,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading reviews",
        isLoading: false,
      });
    }
  },

  fetchPublicReviews: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/store/${slug}/reviews`);
      set({
        reviews: response.data.reviews,
        stats: response.data.stats,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading reviews",
        isLoading: false,
      });
    }
  },

  submitReview: async (slug, data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const response = await api.post(`/store/${slug}/reviews`, data);
      set({ isSubmitting: false, successMessage: response.data.message });
      get().fetchPublicReviews(slug);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Could not submit review",
        isSubmitting: false,
      });
      throw error;
    }
  },

  replyToReview: async (businessId, reviewId, reply) => {
    try {
      await api.post(`/businesses/${businessId}/reviews/${reviewId}/reply`, {
        reply,
      });
      get().fetchVendorReviews(businessId);
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Could not save reply" });
      throw error;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
}));
