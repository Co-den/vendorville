"use client";

import { useAuthStore } from "@/store/authStore";
import { useBusinessStore } from "@/store/businessStore";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import { Subscription } from "@/store/vendorStore";
import { useVendorStore } from "@/store/vendorStore";
import TrialBanner from "@/components/TrialBanner.jsx";
import StaffLimitWarning from "@/components/StaffLimitWarning.jsx";
import UpgradePromptModal from "@/components/UpgradePromptModal.jsx";
import {
  Box,
  LayoutGrid,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import Script from "next/script";
import { JSX, useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import BusinessSection from "./BusinessSection";

const COLORS = [
  "#3a844f",
  "#7fd99a",
  "#b4741a",
  "#dc2626",
  "#3b5fd9",
  "#8134af",
];

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

  const { getSubscription, getStaff } = useVendorStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [staffCount, setStaffCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
  if (!user?.id) return;

  const fetchSubscription = async () => {
    try {
      const sub = await getSubscription(user.id);

      setSubscription(sub);

      if (sub.status === "expired") {
        setShowUpgradeModal(true);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  fetchSubscription();
}, [user?.id, getSubscription]);

useEffect(() => {
  if (!activeBusinessId) return;

  const fetchStaff = async () => {
    try {
      const staff = await getStaff(activeBusinessId);
      setStaffCount(staff.length);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  fetchStaff();
}, [activeBusinessId, getStaff]);
  
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
  const salesByCategory = useMemo(() => {
    const tally: Record<string, number> = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          const category = product?.category || "Other";
          tally[category] =
            (tally[category] || 0) + item.quantity * item.unitPrice;
        });
      });
    return Object.entries(tally).map(([name, value]) => ({ name, value }));
  }, [orders, products]);

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
      />
      {subscription && <TrialBanner subscription={subscription} />}
      {subscription && (
        <StaffLimitWarning
          subscription={subscription}
          staffCount={staffCount}
        />
      )}
      <UpgradePromptModal
        subscription={subscription}
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <LayoutGrid size={25} strokeWidth={2.5} />
          </span>
          <span>OPERATIONS CENTER</span>
        </div>
        <h1>
          Hello, <span>{user?.firstName}</span>.
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
                <div className="stat-icon1">
                  <TrendingUp size={25} />
                </div>
              </div>
              <div className="stat-value">₦{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">TOTAL REVENUE</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon2">
                  <ShoppingCart size={25} />
                </div>
              </div>
              <div className="stat-value">{ordersToday.length}</div>
              <div className="stat-label">ORDERS TODAY</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon3">
                  <Box size={29} />
                </div>
              </div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">PRODUCTS IN STOCK</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon4">
                  <TriangleAlert size={25} />
                </div>
              </div>
              <div className="stat-value">{lowStockItems.length}</div>
              <div className="stat-label">LOW STOCK ALERTS</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="panel">
              <div className="panel-head">
                <h2>Recent Orders</h2>
                <a href="/dashboard/orders" className="panel-link1">
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
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-head">
                <h2>Sales by Category</h2>
              </div>
              {salesByCategory.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--gray)",
                    padding: "40px 0",
                  }}
                >
                  No sales data yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry) => entry.name}
                    >
                      {salesByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(
                        value:
                          | number
                          | string
                          | readonly (number | string)[]
                          | undefined,
                      ) => {
                        const displayValue = Array.isArray(value)
                          ? value[0]
                          : value;
                        return displayValue === undefined
                          ? ""
                          : `₦${Number(displayValue).toLocaleString()}`;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="panel">
              <div className="panel-head">
                <h2>Low Stock Alerts</h2>
                <a href="/dashboard/inventory" className="panel-link1">
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
