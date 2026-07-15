"use client";

import { useAuthStore } from "@/store/authStore";
import { useBusinessStore } from "@/store/businessStore";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import Script from "next/script";
import { JSX, useEffect, useMemo, useState } from "react";
import BusinessSection from "./BusinessSection";

function StatIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    trend: (
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
    ),
    cart: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
    box: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
      </svg>
    ),
    alert: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);
  const firstName = user?.firstName || "Vendor";

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
      fetchProducts(activeBusinessId);
      fetchOrders(activeBusinessId);
    }
  }, [activeBusinessId]);

  // ===== Real stats derived from live data =====
  const todayStr = new Date().toDateString();

  const ordersToday = useMemo(
    () =>
      orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr),
    [orders],
  );

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders],
  );

  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold),
    [products],
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
      />

      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>
          Vendor Dashboard
        </div>
        <h1>
          Welcome back, <span>{firstName}</span>.
        </h1>
        <p>Here's what's happening with your business today.</p>
      </div>

      <BusinessSection />

      {businesses.length > 1 && (
        <div
          className="field-group"
          style={{ maxWidth: 320, marginBottom: 20 }}
        >
          <label className="field-label">Viewing stats for</label>
          <select
            value={activeBusinessId ?? ""}
            onChange={(e) => setActiveBusinessId(Number(e.target.value))}
          >
            {businesses.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {businesses.length > 0 && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">
                  <StatIcon name="trend" />
                </div>
              </div>
              <div className="stat-value">₦{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">
                  <StatIcon name="cart" />
                </div>
              </div>
              <div className="stat-value">{ordersToday.length}</div>
              <div className="stat-label">Orders Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">
                  <StatIcon name="box" />
                </div>
              </div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Products in Stock</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">
                  <StatIcon name="alert" />
                </div>
              </div>
              <div className="stat-value">{lowStockItems.length}</div>
              <div className="stat-label">Low Stock Alerts</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="panel">
              <div className="panel-head">
                <h2>Recent Orders</h2>
                <a href="/dashboard/orders" className="panel-link">
                  View all
                </a>
              </div>
              {recentOrders.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--gray)",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  No orders yet.
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <div>
                      <div className="order-customer">{order.customerName}</div>
                      <div className="order-id">{order.orderNumber}</div>
                    </div>
                    <div />
                    <div className="order-amount">
                      ₦{order.totalAmount.toLocaleString()}
                    </div>
                    <div className={`order-status ${order.status}`}>
                      {order.status}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2>Low Stock Alerts</h2>
                <a href="/dashboard/inventory" className="panel-link">
                  Manage inventory
                </a>
              </div>
              {lowStockItems.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--gray)",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  Nothing running low right now.
                </p>
              ) : (
                lowStockItems.map((item) => (
                  <div className="stock-row" key={item.id}>
                    <div>
                      <div className="stock-name">{item.name}</div>
                      <div className="stock-sub">SKU: {item.sku}</div>
                    </div>
                    <span className="stock-badge">{item.stock} left</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
