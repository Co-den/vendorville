"use client";

import { useWalletStore } from "@/store/walletStore";
import { useEffect, useState } from "react";

const nigerianBanks = [
  { code: "058", name: "GTBank" },
  { code: "044", name: "Access Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "033", name: "UBA" },
  { code: "999992", name: "OPay" },
  { code: "999991", name: "PalmPay" },
];

export default function PayoutPage() {
  const {
    balance,
    bankAccounts,
    isLoading,
    fetchWallet,
    fetchBankAccounts,
    addBankAccount,
    removeBankAccount,
  } = useWalletStore();

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    fetchWallet();
    fetchBankAccounts();
  }, []);

  const formattedBalance = balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setIsVerifying(true);
    try {
      await addBankAccount(bankCode, accountNumber);
      setShowAddAccount(false);
      setBankCode("");
      setAccountNumber("");
    } catch (err: any) {
      setAddError(
        err.response?.data?.message ||
          "Could not verify this account. Check the details and try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="wallet-page-head">
        <div className="wallet-page-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <span className="wallet-page-eyebrow">Finance</span>
      </div>

      <h1 className="wallet-page-title">
        Payout & <span>Transfer</span>.
      </h1>
      <p className="wallet-page-sub">Manage bank accounts and move money.</p>

      <div className="payout-action-grid">
        <div className="payout-action-card">
          <div className="payout-action-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <div className="payout-action-title">Send Money</div>
          <div className="payout-action-sub">Wallet to wallet</div>
        </div>
        <div className="payout-action-card">
          <div className="payout-action-icon amber">
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
          </div>
          <div className="payout-action-title">Withdraw</div>
          <div className="payout-action-sub">To bank account</div>
        </div>
      </div>

      <div className="wallet-balance-strip">
        <div>
          <div className="wallet-balance-strip-label">Wallet Balance</div>
          <div className="wallet-balance-strip-value">₦{formattedBalance}</div>
        </div>
        <button className="icon-btn-small" onClick={fetchWallet}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Bank Accounts</h2>
            <p className="deposit-account-sub">
              {bankAccounts.length}/4 accounts
            </p>
          </div>
          <button
            className="biz-add-btn"
            onClick={() => setShowAddAccount(true)}
            disabled={bankAccounts.length >= 4}
          >
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
            Add Account
          </button>
        </div>

        {bankAccounts.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            No bank accounts added yet.
          </p>
        ) : (
          bankAccounts.map((acc: any) => (
            <div className="bank-account-row" key={acc.id}>
              <div className="bank-account-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                </svg>
              </div>
              <div className="bank-account-info">
                <div className="bank-account-name">
                  {acc.bankName}
                  {acc.isPrimary && (
                    <span className="primary-badge">Primary</span>
                  )}
                </div>
                <div className="bank-account-meta">
                  {acc.accountName} · •••• {acc.accountNumber.slice(-4)}
                </div>
              </div>
              <button
                className="icon-btn-small warn"
                onClick={() => removeBankAccount(acc.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {showAddAccount && (
        <div className="modal-overlay" onClick={() => setShowAddAccount(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Bank Account</h3>
            <p className="modal-sub">
              We'll verify this account before saving it.
            </p>
            <form onSubmit={handleAddAccount}>
              <div className="modal-field">
                <label>Bank</label>
                <select
                  required
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                >
                  <option value="">Select bank</option>
                  {nigerianBanks.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
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
              {addError && <div className="error-message">{addError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => setShowAddAccount(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-modal"
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify & Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
