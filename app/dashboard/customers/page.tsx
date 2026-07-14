"use client";

import { useBusinessStore } from "@/store/businessStore";
import { useCustomerStore, type Customer } from "@/store/customerStore";
import { useEffect, useMemo, useState } from "react";

export default function CustomersPage() {
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { customers, isLoading, fetchCustomers, saveNote } = useCustomerStore();

  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (businesses.length > 0 && activeBusinessId === null) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    if (activeBusinessId !== null) {
      fetchCustomers(activeBusinessId);
    }
  }, [activeBusinessId]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search)),
    );
  }, [customers, search]);

  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const openNoteEditor = (customer: Customer) => {
    setEditingCustomer(customer);
    setNoteText(customer.notes || "");
  };

  const closeNoteEditor = () => {
    setEditingCustomer(null);
    setNoteText("");
  };

  const handleSaveNote = async () => {
    if (!editingCustomer?.phone || activeBusinessId === null) return;
    setIsSaving(true);
    try {
      await saveNote(
        activeBusinessId,
        editingCustomer.phone,
        editingCustomer.name,
        noteText,
      );
      closeNoteEditor();
    } finally {
      setIsSaving(false);
    }
  };

  if (businesses.length === 0) {
    return (
      <>
        <div className="dash-welcome">
          <div className="dash-welcome-eyebrow">
            <span className="dot"></span>
            Customers
          </div>
          <h1>
            Know your <span>customers</span>.
          </h1>
        </div>
        <div
          className="panel"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
            You need to register a business before customers can appear here.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>
          Customers
        </div>
        <h1>
          Know your <span>customers</span>.
        </h1>
        <p>Customers are added automatically from your order history.</p>
      </div>

      {businesses.length > 1 && (
        <div
          className="field-group"
          style={{ maxWidth: 320, marginBottom: 20 }}
        >
          <label className="field-label">Business</label>
          <select
            value={activeBusinessId ?? ""}
            onChange={(e) => setActiveBusinessId(Number(e.target.value))}
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className="stat-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{repeatCustomers}</div>
          <div className="stat-label">Repeat Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="stat-value">₦{totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="panel">
        <div className="inventory-search" style={{ marginBottom: 16 }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--gray)",
            }}
          >
            Loading...
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--gray)",
              fontSize: "0.86rem",
            }}
          >
            {customers.length === 0
              ? "No customers yet they appear here after your first order."
              : "No customers match your search."}
          </p>
        ) : (
          <div className="inventory-table">
            <div
              className="inventory-table-head"
              style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.6fr" }}
            >
              <span>Customer</span>
              <span>Orders</span>
              <span>Total Spent</span>
              <span>Last Order</span>
              <span></span>
            </div>
            {filteredCustomers.map((customer) => (
              <div
                className="inventory-row"
                key={customer.phone || customer.name}
                style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.6fr" }}
              >
                <div className="inventory-product-cell">
                  <div className="inventory-thumb">{customer.name[0]}</div>
                  <div>
                    <div className="inventory-name">{customer.name}</div>
                    <div className="inventory-sku">
                      {customer.phone || "No phone on record"}
                    </div>
                  </div>
                </div>
                <span className="inventory-stock">{customer.orderCount}</span>
                <span className="inventory-price">
                  ₦{customer.totalSpent.toLocaleString()}
                </span>
                <span className="inventory-category">
                  {new Date(customer.lastOrderAt).toLocaleDateString("en-NG", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="inventory-actions">
                  <button
                    className="icon-btn-small"
                    onClick={() => openNoteEditor(customer)}
                    title="Add note"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="15"
                      height="15"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingCustomer && (
        <div className="modal-overlay" onClick={closeNoteEditor}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCustomer.name}</h3>
            <p className="modal-sub">{editingCustomer.phone}</p>
            <div className="modal-field">
              <label>Notes</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Prefers delivery on weekends, buys in bulk..."
                style={{ minHeight: 100 }}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary-modal" onClick={closeNoteEditor}>
                Cancel
              </button>
              <button
                className="btn-primary-modal"
                onClick={handleSaveNote}
                disabled={isSaving || !editingCustomer.phone}
              >
                {isSaving ? "Saving..." : "Save Note"}
              </button>
            </div>
            {!editingCustomer.phone && (
              <p
                style={{
                  fontSize: "0.76rem",
                  color: "var(--gray)",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Notes require a phone number on file for this customer.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
