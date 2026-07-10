"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function WalletCard() {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState(128450); // mock balance in naira
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<"form" | "success">("form");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositError, setDepositError] = useState("");

  const formattedBalance = balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [naira, kobo] = formattedBalance.split(".");

  const handleDeposit = () => {
    setDepositError("");

    if (!window.PaystackPop) {
      setDepositError(
        "Payment system is still loading. Please try again in a moment.",
      );
      return;
    }

    const depositAmount = 10000; // ₦10,000 — replace with a user-entered amount if you add an input

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "vendor@example.com",
      amount: depositAmount * 100, // kobo
      currency: "NGN",
      ref: `vh_${Date.now()}`,
      callback: (response: any) => {
        // In production: send response.reference to your backend to verify
        // via Paystack's /transaction/verify/:reference endpoint before crediting.
        setBalance((prev) => prev + depositAmount);
      },
      onClose: () => {
        // user closed the popup without paying — no action needed
      },
    });

    handler.openIframe();
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock — real withdrawals need a backend endpoint using Paystack's
    // Transfer Recipient + Transfer API (requires your secret key server-side).
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setBalance((prev) => prev - Number(amount));
    setIsSubmitting(false);
    setWithdrawStep("success");
  };

  const closeWithdrawModal = () => {
    setShowWithdraw(false);
    setWithdrawStep("form");
    setAmount("");
    setBank("");
    setAccountNumber("");
  };

  return (
    <>
      <div className="wallet-card">
        <div className="wallet-status">
          <span className="dot"></span>
          Wallet Active
        </div>
        <div className="wallet-label">Available Balance</div>
        <div className="wallet-balance">
          ₦{naira}
          <span className="kobo">.{kobo}</span>
        </div>

        <div className="wallet-actions">
          <button className="wallet-btn deposit" onClick={handleDeposit}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Deposit
          </button>
          <button
            className="wallet-btn withdraw"
            onClick={() => setShowWithdraw(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            Withdraw
          </button>
        </div>

        {depositError && (
          <div className="wallet-note" style={{ color: "#fca5a5" }}>
            {depositError}
          </div>
        )}

        <div className="wallet-note">
          Deposits are processed instantly via Paystack. Withdrawals are
          reviewed and paid out within 1 business day.
        </div>
      </div>

      {showWithdraw && (
        <div className="modal-overlay" onClick={closeWithdrawModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {withdrawStep === "form" ? (
              <>
                <h3>Withdraw Funds</h3>
                <p className="modal-sub">
                  Transfers are sent to your registered bank account.
                </p>
                <form onSubmit={handleWithdrawSubmit}>
                  <div className="modal-field">
                    <label>Amount (₦)</label>
                    <input
                      type="number"
                      min="1000"
                      max={balance}
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 20000"
                    />
                  </div>
                  <div className="modal-field">
                    <label>Bank</label>
                    <select
                      required
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    >
                      <option value="">Select bank</option>
                      <option value="gtbank">GTBank</option>
                      <option value="access">Access Bank</option>
                      <option value="zenith">Zenith Bank</option>
                      <option value="uba">UBA</option>
                      <option value="opay">OPay</option>
                    </select>
                  </div>
                  <div className="modal-field">
                    <label>Account Number</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0123456789"
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary-modal"
                      onClick={closeWithdrawModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-modal"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="modal-success">
                <div className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Withdrawal Requested</h3>
                <p className="modal-sub">
                  ₦{Number(amount).toLocaleString()} is on its way to your{" "}
                  {bank} account ending in {accountNumber.slice(-4)}. This
                  usually takes up to 1 business day.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn-primary-modal"
                    style={{ flex: "none", width: "100%" }}
                    onClick={closeWithdrawModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
