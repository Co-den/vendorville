"use client";

import { useAuthStore } from "@/store/authStore";
import Script from "next/script";
import { JSX } from "react/jsx-runtime";
import BusinessSection from "./BusinessSection";
import WalletCard from "./walletcard";

const mockStats = [
  {
    label: "Total Revenue",
    value: "₦482,300",
    trend: "+12.4%",
    up: true,
    icon: "trend",
  },
  {
    label: "Orders Today",
    value: "34",
    trend: "+6.1%",
    up: true,
    icon: "cart",
  },
  {
    label: "Products in Stock",
    value: "128",
    trend: "-3.2%",
    up: false,
    icon: "box",
  },
  {
    label: "Low Stock Alerts",
    value: "5",
    trend: "+2",
    up: false,
    icon: "alert",
  },
];

const mockOrders = [
  {
    id: "#VH-2481",
    customer: "Chidinma Okeke",
    amount: "₦18,500",
    status: "paid",
  },
  {
    id: "#VH-2480",
    customer: "Emeka Obi",
    amount: "₦6,200",
    status: "pending",
  },
  {
    id: "#VH-2479",
    customer: "Aisha Bello",
    amount: "₦42,000",
    status: "paid",
  },
  {
    id: "#VH-2478",
    customer: "Tunde Adeyemi",
    amount: "₦3,750",
    status: "failed",
  },
];

const mockLowStock = [
  { name: "Ankara Fabric Bundle", sub: "SKU: AF-1029", left: 3 },
  { name: "Beaded Sandals (Size 40)", sub: "SKU: BS-4021", left: 2 },
  { name: "Shea Butter — 500ml", sub: "SKU: SB-0087", left: 5 },
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
  const firstName = user?.firstName || "Vendor";

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
      <div className="stat-grid">
        {mockStats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-top">
              <div className="stat-icon">
                <StatIcon name={stat.icon} />
              </div>
              <span className={`stat-trend ${stat.up ? "up" : "down"}`}>
                {stat.trend}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <WalletCard />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="panel">
            <div className="panel-head">
              <h2>Recent Orders</h2>
              <a href="/dashboard/orders" className="panel-link">
                View all
              </a>
            </div>
            {mockOrders.map((order) => (
              <div className="order-row" key={order.id}>
                <div>
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-id">{order.id}</div>
                </div>
                <div />
                <div className="order-amount">{order.amount}</div>
                <div className={`order-status ${order.status}`}>
                  {order.status}
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Low Stock Alerts</h2>
              <a href="/dashboard/inventory" className="panel-link">
                Manage inventory
              </a>
            </div>
            {mockLowStock.map((item) => (
              <div className="stock-row" key={item.name}>
                <div>
                  <div className="stock-name">{item.name}</div>
                  <div className="stock-sub">{item.sub}</div>
                </div>
                <span className="stock-badge">{item.left} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
