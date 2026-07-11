import axios from "axios";
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useWalletStore = create((set, get) => ({
  balance: 0,
  accountNumber: null,
  bankName: null,
  accountName: null,
  transactions: [],
  bankAccounts: [],
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/wallet`);
      set({
        balance: response.data.balance,
        accountNumber: response.data.accountNumber,
        bankName: response.data.bankName,
        accountName: response.data.accountName,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error loading wallet",
        isLoading: false,
      });
    }
  },

  fetchTransactions: async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet/transactions`);
      set({ transactions: response.data.transactions });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error loading transactions",
      });
    }
  },

  regenerateAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/wallet/generate-account`);
      set({
        accountNumber: response.data.accountNumber,
        bankName: response.data.bankName,
        accountName: response.data.accountName,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error generating account",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchBankAccounts: async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet/bank-accounts`);
      set({ bankAccounts: response.data.bankAccounts });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error loading bank accounts",
      });
    }
  },

  addBankAccount: async (bankCode, accountNumber) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/bank-accounts`, {
        bankCode,
        accountNumber,
      });
      set({ bankAccounts: [...get().bankAccounts, response.data.account] });
      return response.data.account;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding bank account",
      });
      throw error;
    }
  },

  removeBankAccount: async (accountId) => {
    try {
      await axios.delete(`${API_URL}/wallet/bank-accounts/${accountId}`);
      set({
        bankAccounts: get().bankAccounts.filter((a) => a.id !== accountId),
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error removing bank account",
      });
      throw error;
    }
  },

  withdraw: async (amount, bankAccountId) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/withdraw`, {
        amount,
        bankAccountId,
      });
      set({ balance: response.data.newBalance });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error processing withdrawal",
      });
      throw error;
    }
  },

  transfer: async (recipientEmail, amount) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/transfer`, {
        recipientEmail,
        amount,
      });
      set({ balance: response.data.newBalance });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error sending money" });
      throw error;
    }
  },
}));
