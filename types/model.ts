export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  businessId: number;
  customerId?: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;

  // Order details
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount?: number;
  totalAmount: number;

  // Status & Payment
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
  paymentStatus: "unpaid" | "paid" | "partially_paid" | "refunded";
  paymentMethod?: "card" | "transfer" | "cash" | "paystack";

  // Tracking
  trackingNumber?: string;
  riderId?: number;
  riderName?: string;
  estimatedDelivery?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  [key: string]: unknown;
}

// Transaction Interface
export interface Transaction {
  id: number;
  businessId: number;
  orderId?: number;

  // Transaction details
  type: "sale" | "refund" | "withdrawal" | "deposit" | "adjustment";
  amount: number;
  currency: string;

  // Status
  status: "pending" | "completed" | "failed" | "reversed";

  // Payment info
  paymentMethod?: "card" | "transfer" | "cash" | "paystack";
  paystackReference?: string;
  paystackAuthCode?: string;

  // Recipient/Payer
  description?: string;
  reference?: string;

  // For withdrawals
  bankAccount?: string;
  bankCode?: string;
  recipientName?: string;

  // Metadata
  metadata?: {
    [key: string]: unknown;
  };

  // Timestamps
  createdAt: string;
  completedAt?: string;

  [key: string]: unknown;
}

// Analytics/Stats Interfaces
export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  totalUnitsSold: number;
}

export interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;
  totalRefunds: number;
  totalWithdrawals: number;
  pendingTransactions: number;
}

export interface DateRangeStats {
  orders: OrderStats;
  transactions: TransactionStats;
  period: {
    startDate: string;
    endDate: string;
  };
}
