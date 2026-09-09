"use client";

import { useBusinessStore } from "@/store/businessStore";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import { useVendorStore } from "@/store/vendorStore";
import MonthCalendar from "@/components/MonthCalendar";
import type { Order, Transaction, DateRangeStats } from "@/types/model";
import { Activity, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";



interface MonthData {
  month: string;
  year: number;
  value: string;
  startDate: string;
  endDate: string;
}

export default function AnalyticsPage() {
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);
  const { getOrdersByDateRange, getTransactionsByDateRange, getStatsByDateRange } =
    useVendorStore();
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [order, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DateRangeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const businessId = 1;
  
  const handleMonthSelect = async (monthData: MonthData): Promise<void> => {
    setSelectedMonth(monthData);
    setIsLoading(true);
    setError(null);

    try {
      const [ordersData, transactionsData, statsData] = await Promise.all([
        getOrdersByDateRange(businessId, monthData.startDate, monthData.endDate),
        getTransactionsByDateRange(
          businessId,
          monthData.startDate,
          monthData.endDate
        ),
        getStatsByDateRange(businessId, monthData.startDate, monthData.endDate),
      ]);

      setOrders(ordersData);
      setTransactions(transactionsData);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics data"
      );
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const validOrders = useMemo(
    () => orders.filter((o) => o.status !== "cancelled"),
    [orders],
  );

  // Last 7 days revenue trend
  const last7Days = useMemo(() => {
    const days: { label: string; date: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const total = validOrders
        .filter((o) => new Date(o.createdAt).toDateString() === dateStr)
        .reduce((sum, o) => sum + o.totalAmount, 0);
      days.push({
        label: d.toLocaleDateString("en-NG", { weekday: "short" }),
        date: dateStr,
        total,
      });
    }
    return days;
  }, [validOrders]);

  const maxDayTotal = Math.max(...last7Days.map((d) => d.total), 1);

  // Top products by units sold
  const topProducts = useMemo(() => {
    const tally: Record<
      string,
      { name: string; units: number; revenue: number }
    > = {};
    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productName;
        if (!tally[key])
          tally[key] = { name: item.productName, units: 0, revenue: 0 };
        tally[key].units += item.quantity;
        tally[key].revenue += item.quantity * item.unitPrice;
      });
    });
    return Object.values(tally)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [validOrders]);

  // Payment method breakdown
  const paymentBreakdown = useMemo(() => {
    const tally: Record<string, number> = {};
    validOrders.forEach((o) => {
      tally[o.paymentMethod] = (tally[o.paymentMethod] || 0) + o.totalAmount;
    });
    return tally;
  }, [validOrders]);

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue =
    validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
  const totalUnitsSold = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const handleExport = () => {
    if (!activeBusinessId) return;
    const token = localStorage.getItem("token");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/businesses/${activeBusinessId}/export/orders`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = "orders-export.csv";
        a.click();
      });
  };
  if (businesses.length === 0) {
    return (
      <>
        <div className="dash-welcome">
          <div className="dash-welcome-eyebrow">
            <span className="dash-welcome-icon">
              <Activity size={25} strokeWidth={2.5} />
            </span>
            <span>ANALYSIS</span>
          </div>
          <h1>
            Track your <span>growth</span>.
          </h1>
        </div>

        <div
          className="panel"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
            Register a business and start taking orders to see analytics here.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <Activity size={25} strokeWidth={2.5} />
          </span>
          <span>ANALYSIS</span>
        </div>
        <h1>
          Track your <span>growth</span>.
        </h1>
        <p>Sales trends, top products, and performance at a glance.</p>
      </div>
      <button
        className="biz-add-btn"
        onClick={handleExport}
        style={{ marginLeft: "auto" }}
      >
        <Download />
        Export CSV
      </button>
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
            {businesses.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">₦{totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{validOrders.length}</div>
          <div className="stat-label">Completed Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            ₦{Math.round(avgOrderValue).toLocaleString()}
          </div>
          <div className="stat-label">Avg. Order Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalUnitsSold}</div>
          <div className="stat-label">Units Sold</div>
        </div>
      </div>
      <MonthCalendar onMonthSelect={handleMonthSelect} />

      {isLoading && <div className="loading">Loading...</div>}

      {error && <div className="error-message">{error}</div>}

      {selectedMonth && stats && (
        <div className="analytics-data">
          <h2>
            {selectedMonth.month} {selectedMonth.year}
          </h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.orders.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Orders</h3>
              <p className="stat-value">{stats.orders.completedOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">₦{stats.orders.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Average Order Value</h3>
              <p className="stat-value">₦{stats.orders.averageOrderValue.toLocaleString()}</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-section">
            <h3>Orders ({orders.length})</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>₦{order.totalAmount.toLocaleString()}</td>
                    <td className={`status-${order.status}`}>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transactions Table */}
          <div className="transactions-section">
            <h3>Transactions ({transactions.length})</h3>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.type}</td>
                    <td>₦{transaction.amount.toLocaleString()}</td>
                    <td className={`status-${transaction.status}`}>
                      {transaction.status}
                    </td>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <h2>Revenue Last 7 Days</h2>
        </div>
        <div className="revenue-chart">
          {last7Days.map((day) => (
            <div className="revenue-bar-col" key={day.date}>
              <div className="revenue-bar-track">
                <div
                  className="revenue-bar-fill"
                  style={{ height: `${(day.total / maxDayTotal) * 100}%` }}
                  title={`₦${day.total.toLocaleString()}`}
                />
              </div>
              <span className="revenue-bar-label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h2>Top Products</h2>
          </div>
          {topProducts.length === 0 ? (
            <p
              style={{
                fontSize: "0.86rem",
                color: "var(--gray)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              No sales yet.
            </p>
          ) : (
            topProducts.map((p, i) => (
              <div className="stock-row" key={p.name}>
                <div>
                  <div className="stock-name">
                    {i + 1}. {p.name}
                  </div>
                  <div className="stock-sub">{p.units} units sold</div>
                </div>
                <span
                  className="stock-badge"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-light)",
                  }}
                >
                  ₦{p.revenue.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Payment Methods</h2>
          </div>
          {Object.keys(paymentBreakdown).length === 0 ? (
            <p
              style={{
                fontSize: "0.86rem",
                color: "var(--gray)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              No payment data yet.
            </p>
          ) : (
            Object.entries(paymentBreakdown).map(([method, amount]) => (
              <div className="stock-row" key={method}>
                <div
                  className="stock-name"
                  style={{ textTransform: "capitalize" }}
                >
                  {method}
                </div>
                <span
                  className="stock-badge"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-light)",
                  }}
                >
                  ₦{amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
