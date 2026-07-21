import { create } from "zustand";
import api from "./axiosInstance";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: number;
  businessId: number;
  name: string;
  sku: string;
  category: string;
  imageUrl: string | null;
  price: number; // naira, already converted from kobo by backend
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  lowStockThreshold: string;
  image?: File | null;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchProducts: (businessId: number) => Promise<void>;
  createProduct: (
    businessId: number,
    data: ProductFormData,
  ) => Promise<Product>;
  updateProduct: (
    businessId: number,
    productId: number,
    data: ProductFormData,
  ) => Promise<Product>;
  deleteProduct: (businessId: number, productId: number) => Promise<void>;
  clearProducts: () => void;
}

const buildFormData = (data: ProductFormData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("sku", data.sku);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  formData.append("lowStockThreshold", data.lowStockThreshold);
  if (data.image) formData.append("image", data.image);
  return formData;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchProducts: async (businessId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(
        `/businesses/${businessId}/products`,
      );
      set({ products: response.data.products, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error loading inventory",
        isLoading: false,
      });
    }
  },

  createProduct: async (businessId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const formData = buildFormData(data);
      const response = await api.post(
        `/businesses/${businessId}/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const newProduct: Product = response.data.product;
      set({ products: [newProduct, ...get().products], isSubmitting: false });
      return newProduct;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error adding product",
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateProduct: async (businessId, productId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const formData = buildFormData(data);
      const response = await api.patch(
        `/businesses/${businessId}/products/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const updated: Product = response.data.product;
      set({
        products: get().products.map((p) => (p.id === productId ? updated : p)),
        isSubmitting: false,
      });
      return updated;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error updating product",
        isSubmitting: false,
      });
      throw error;
    }
  },

  deleteProduct: async (businessId, productId) => {
    try {
      await api.delete(
        `/businesses/${businessId}/products/${productId}`,
      );
      set({ products: get().products.filter((p) => p.id !== productId) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error deleting product" });
      throw error;
    }
  },

  clearProducts: () => set({ products: [] }),
}));
