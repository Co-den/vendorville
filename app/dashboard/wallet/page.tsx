"use client";

import { useWalletStore } from "@/store/walletStore";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const {
    balance,
    accountNumber,
    bankName,
    accountName,
    transactions,
    isLoading,
    error,
    fetchWallet,
    fetchTransactions,
    regenerateAccount,
  } = useWalletStore();

  const [copied, setCopied] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const formattedBalance = balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [naira, kobo] = formattedBalance.split(".");

  const handleCopy = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    try {
      await regenerateAccount();
    } catch {
      // error already set in store
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
            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
            <path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
          </svg>
        </div>
        <span className="wallet-page-eyebrow">E-Wallet</span>
      </div>

      <h1 className="wallet-page-title">
        Your <span>Wallet</span>.
      </h1>
      <p className="wallet-page-sub">
        View your balance and transaction history.
      </p>

      <div className="wallet-hero">
        <div className="wallet-hero-label">Available Balance</div>
        <div className="wallet-hero-balance">
          ₦{isLoading ? "···" : naira}
          {!isLoading && <span className="kobo">.{kobo}</span>}
        </div>
        <div className="wallet-hero-usd">
          ≈ ${(balance / 1500).toFixed(2)} USD
        </div>
        <div className="wallet-hero-owner">{accountName || "Your Account"}</div>

        <div className="wallet-hero-actions">
          <button
            className="wallet-hero-btn"
            onClick={() => setShowTransfer(true)}
          >
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
            Transfer
          </button>
          <button
            className="wallet-hero-btn"
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
          <button className="wallet-hero-btn">
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
            Card Payment
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="deposit-account-title">
            <div className="deposit-account-icon">
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
            <div>
              <h2>Deposit Account</h2>
              <p className="deposit-account-sub">
                Send money here to top up your wallet
              </p>
            </div>
          </div>
          <span className="paystack-badge">Paystack</span>
        </div>

        {accountNumber ? (
          <div className="deposit-details">
            <div className="deposit-row">
              <span className="deposit-label">Bank</span>
              <span className="deposit-value">{bankName}</span>
            </div>
            <div className="deposit-row">
              <span className="deposit-label">Name</span>
              <span className="deposit-value">{accountName}</span>
            </div>
            <div className="deposit-row">
              <span className="deposit-label">Account No.</span>
              <span className="deposit-value with-actions">
                {accountNumber}
                <button
                  className="icon-btn-small"
                  onClick={handleCopy}
                  title="Copy"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="14"
                    height="14"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
                <button
                  className="icon-btn-small warn"
                  onClick={handleRegenerate}
                  title="Generate new account number"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="14"
                    height="14"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                </button>
              </span>
            </div>
            {copied && <div className="copy-toast">Copied to clipboard</div>}
            <p className="deposit-note">
              Payments sent here are automatically credited to your wallet.
            </p>
            <p className="deposit-issue-note">
              Having issues?{" "}
              <button className="link-btn" onClick={handleRegenerate}>
                Tap to generate a new account number.
              </button>
            </p>
          </div>
        ) : (
          <div className="deposit-empty">
            <button
              className="btn-create"
              onClick={handleRegenerate}
              disabled={isLoading}
            >
              {isLoading ? "Setting up..." : "Generate Deposit Account"}
            </button>
          </div>
        )}
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-transactions-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12V7H5a2 2 0 010-4h14v4" />
                <path d="M3 5v14a2 2 0 002 2h16v-5" />
                <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
              </svg>
            </div>
            <p className="empty-transactions-title">No transactions yet</p>
            <p className="empty-transactions-sub">
              Fund your wallet to get started
            </p>
          </div>
        ) : (
          transactions.map((tx: any) => (
            <div className="order-row" key={tx.id}>
              <div>
                <div className="order-customer">{tx.description}</div>
                <div className="order-id">{tx.date}</div>
              </div>
              <div />
              <div className="order-amount">
                {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </div>
              <div className={`order-status ${tx.status}`}>{tx.status}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
