declare module "@paystack/inline-js" {
  interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    onSuccess?: (transaction: any) => void;
    onCancel?: () => void;
    onError?: (error: any) => void;
    onLoad?: (response: any) => void;
  }

  class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): Promise<void>;
  }

  export default PaystackPop;
}
