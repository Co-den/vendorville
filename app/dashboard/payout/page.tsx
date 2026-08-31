"use client";

import { useWalletStore } from "@/store/walletStore";
import { BanknoteArrowDown, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

type BankAccount = {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isPrimary: boolean;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function PayoutPage() {
  const {
    balance,
    banks,
    bankAccounts,
    fetchWallet,
    fetchBankAccounts,
    fetchBanks,
    resolveAccount,
    addBankAccount,
    removeBankAccount,
    withdraw,
    transfer,
  } = useWalletStore();

  // Add bank account
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addError, setAddError] = useState("");

  // Send money
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSendingMoney, setIsSendingMoney] = useState(false);

  // Withdraw
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAccountId, setWithdrawAccountId] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchWallet();
    fetchBankAccounts();
    fetchBanks();
  }, [fetchWallet, fetchBankAccounts, fetchBanks]);

  const formattedBalance = balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Resolve bank account
  const handleResolveAccount = async () => {
    setResolvedName("");
    setAddError("");

    if (!bankCode || !/^\d{10}$/.test(accountNumber)) {
      return;
    }

    setIsResolving(true);

    try {
      const result = await resolveAccount(bankCode, accountNumber);
      setResolvedName(result.accountName);
    } catch (err: unknown) {
      const error = err as ApiError;

      setAddError(
        error.response?.data?.message || "Could not verify this account.",
      );
    } finally {
      setIsResolving(false);
    }
  };

  // Save bank account
  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bankCode || !/^\d{10}$/.test(accountNumber) || !resolvedName) {
      setAddError("Please resolve the account before saving.");
      return;
    }

    setIsSaving(true);
    setAddError("");

    try {
      await addBankAccount(bankCode, accountNumber);
      closeModal();
    } catch (err: unknown) {
      const error = err as ApiError;

      setAddError(
        error.response?.data?.message || "Could not save this account.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Send money
  const handleSendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendError("");

    const amount = parseFloat(sendAmount);

    if (!sendAmount || !sendRecipient) {
      setSendError("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setSendError("Please enter a valid amount.");
      return;
    }

    if (amount > balance) {
      setSendError("Insufficient balance.");
      return;
    }

    setIsSendingMoney(true);

    try {
      await transfer(sendRecipient, amount);
      closeSendMoneyModal();
    } catch (err: unknown) {
      const error = err as ApiError;

      setSendError(error.response?.data?.message || "Failed to send money.");
    } finally {
      setIsSendingMoney(false);
    }
  };

  // Withdraw
  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWithdrawError("");

    const amount = parseFloat(withdrawAmount);

    if (!withdrawAmount || !withdrawAccountId) {
      setWithdrawError("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }

    if (amount > balance) {
      setWithdrawError("Insufficient balance.");
      return;
    }

    setIsWithdrawing(true);

    try {
      await withdraw(amount, withdrawAccountId);
      closeWithdrawModal();
    } catch (err: unknown) {
      const error = err as ApiError;

      setWithdrawError(
        error.response?.data?.message || "Failed to process withdrawal.",
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Close add-account modal
  const closeModal = () => {
    setShowAddAccount(false);
    setBankCode("");
    setAccountNumber("");
    setResolvedName("");
    setAddError("");
    setIsResolving(false);
  };

  // Close send-money modal
  const closeSendMoneyModal = () => {
    setShowSendMoney(false);
    setSendAmount("");
    setSendRecipient("");
    setSendError("");
  };

  // Close withdrawal modal
  const closeWithdrawModal = () => {
    setShowWithdraw(false);
    setWithdrawAmount("");
    setWithdrawAccountId("");
    setWithdrawError("");
  };

  // Remove bank account
  const handleRemoveBankAccount = async (account: BankAccount) => {
    const confirmed = window.confirm(
      `Remove ${account.bankName} account ending in ${account.accountNumber.slice(
        -4,
      )}?`,
    );

    if (!confirmed) return;

    try {
      await removeBankAccount(account.id);
    } catch (err) {
      console.error("Failed to remove bank account:", err);
    }
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <Wallet size={25} strokeWidth={2.5} />
          </span>
          <span>FINANCE</span>
        </div>
        <h1>
          Payout &<span>Transfer</span>.
        </h1>
        <p>Manage bank accounts and move money.</p>
      </div>
      <div className="payout-action-grid">
        <div
          className="payout-action-card"
          onClick={() => setShowSendMoney(true)}
          style={{ cursor: "pointer" }}
        >
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
          <div className="payout-action-sub">
            Send funds to another wallet instantly
          </div>
        </div>

        <div
          className="payout-action-card"
          onClick={() => setShowWithdraw(true)}
          style={{ cursor: "pointer" }}
        >
          <div className="payout-action-icon amber">
            <BanknoteArrowDown />
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
          <RefreshCw size={25} />
        </button>
      </div>

      {/* Bank Accounts */}
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
          bankAccounts.map((acc: BankAccount) => (
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
                onClick={() => handleRemoveBankAccount(acc)}
                title="Remove bank account"
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

      {/* Add Bank Account Modal */}
      {showAddAccount && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Bank Account</h3>

            <p className="modal-sub">
              We'll verify this account before saving it.
            </p>

            <form onSubmit={handleSaveAccount}>
              <div className="modal-field">
                <label>Bank</label>

                <select
                  required
                  value={bankCode}
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    setResolvedName("");
                    setAddError("");
                  }}
                >
                  <option value="">Select bank</option>

                  {banks.map((bank: any) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Account Number</label>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setAccountNumber(value);
                    setResolvedName("");
                    setAddError("");
                  }}
                  onBlur={handleResolveAccount}
                  placeholder="0123456789"
                />
              </div>

              <div className="modal-field">
                <label>Account Name</label>

                <input
                  type="text"
                  readOnly
                  value={isResolving ? "Resolving..." : resolvedName}
                  placeholder="Auto-filled after entering account number"
                  style={{ background: "var(--offwhite)" }}
                />
              </div>

              {addError && <div className="error-message">{addError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary-modal"
                  disabled={
                    isSaving ||
                    isResolving ||
                    !resolvedName ||
                    !/^\d{10}$/.test(accountNumber)
                  }
                >
                  {isSaving ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Money Modal */}
      {showSendMoney && (
        <div className="modal-overlay" onClick={closeSendMoneyModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Send Money</h3>

            <p className="modal-sub">
              Transfer funds to another VendorVille user.
            </p>

            <form onSubmit={handleSendMoney}>
              <div className="modal-field">
                <label>Recipient Email</label>

                <input
                  type="email"
                  required
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder="recipient@email.com"
                />
              </div>

              <div className="modal-field">
                <label>Amount</label>

                <input
                  type="number"
                  required
                  min="1"
                  max={balance}
                  step="0.01"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                />

                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--gray)",
                    marginTop: "4px",
                  }}
                >
                  Available: ₦{formattedBalance}
                </div>
              </div>

              {sendError && <div className="error-message">{sendError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={closeSendMoneyModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary-modal"
                  disabled={isSendingMoney || !sendAmount || !sendRecipient}
                >
                  {isSendingMoney ? "Sending..." : "Send Money"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="modal-overlay" onClick={closeWithdrawModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Withdraw Funds</h3>

            <p className="modal-sub">Transfer to your bank account.</p>

            {bankAccounts.length === 0 ? (
              <div
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  color: "var(--gray)",
                }}
              >
                <p>Add a bank account first to withdraw funds.</p>

                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => {
                    closeWithdrawModal();
                    setShowAddAccount(true);
                  }}
                  style={{ marginTop: "12px" }}
                >
                  Add Bank Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="modal-field">
                  <label>Bank Account</label>

                  <select
                    required
                    value={withdrawAccountId}
                    onChange={(e) => setWithdrawAccountId(e.target.value)}
                  >
                    <option value="">Select account</option>

                    {bankAccounts.map((acc: BankAccount) => (
                      <option key={acc.id} value={String(acc.id)}>
                        {acc.bankName} - {acc.accountName} (••••{" "}
                        {acc.accountNumber.slice(-4)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-field">
                  <label>Amount</label>

                  <input
                    type="number"
                    required
                    min="1"
                    max={balance}
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                  />

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--gray)",
                      marginTop: "4px",
                    }}
                  >
                    Available: ₦{formattedBalance}
                  </div>
                </div>

                {withdrawError && (
                  <div className="error-message">{withdrawError}</div>
                )}

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
                    disabled={
                      isWithdrawing || !withdrawAmount || !withdrawAccountId
                    }
                  >
                    {isWithdrawing ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
