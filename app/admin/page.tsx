"use client";

import { adminApi } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const planLabels: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

const defaultStats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  planCounts: { starter: 0, professional: 0, enterprise: 0 },
  planBusinessCounts: { starter: 0, professional: 0, enterprise: 0 },
  totalSubscriptionRevenue: 0,
  locationData: [] as { state: string; count: number }[],
  topSellingVendor: undefined as { name: string; totalSales: number } | undefined,
  topVendorState: "N/A",
};

const COLORS = [
  "#3a844f",
  "#7fd99a",
  "#b4741a",
  "#dc2626",
  "#3b5fd9",
  "#8134af",
  "#f0a23a",
  "#0369a1",
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get("/admin/stats")
      .then((res) => {
        setStats({ ...defaultStats, ...res.data.stats });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="admin-loading">Loading...</div>;

  const maxStateCount = Math.max(...stats.locationData.map((d) => d.count), 1);

  return (
    <div>
      <h1>Overview</h1>
      <div className="admin-section-grid" style={{ marginTop: 20 }}>
        <div className="admin-stat-card">
          <div className="label">Top Selling Vendor</div>
          <div className="value" style={{ fontSize: "1.2rem" }}>
            {stats.topSellingVendor?.name || "N/A"}
          </div>
          {stats.topSellingVendor && (
            <div className="admin-plan-sub">
              ₦{stats.topSellingVendor.totalSales.toLocaleString()} in sales
            </div>
          )}
        </div>
        <div className="admin-stat-card">
          <div className="label">State with Most Vendors</div>
          <div className="value" style={{ fontSize: "1.2rem" }}>
            {stats.topVendorState}
          </div>
        </div>
      </div>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="value">{stats.total}</div>
          <div className="label">Total Businesses</div>
        </div>
        <div className="admin-stat-card pending">
          <div className="value">{stats.pending}</div>
          <div className="label">Pending Review</div>
        </div>
        <div className="admin-stat-card approved">
          <div className="value">{stats.approved}</div>
          <div className="label">Approved</div>
        </div>
        <div className="admin-stat-card rejected">
          <div className="value">{stats.rejected}</div>
          <div className="label">Rejected</div>
        </div>
      </div>

      <div className="admin-stat-card revenue-card" style={{ marginTop: 20 }}>
        <div className="label">Total Monthly Subscription Revenue</div>
        <div className="value large">
          ₦{stats.totalSubscriptionRevenue.toLocaleString()}
        </div>
      </div>

      <div className="admin-section-grid">
        <div className="admin-panel">
          <h2>Subscriptions by Plan</h2>
          {Object.entries(stats.planCounts).map(([plan, count]) => (
            <div className="admin-plan-row" key={plan}>
              <div>
                <div className="admin-plan-name">{planLabels[plan]}</div>
                <div className="admin-plan-sub">
                  {
                    stats.planBusinessCounts[
                      plan as keyof typeof stats.planBusinessCounts
                    ]
                  }{" "}
                  business
                  {stats.planBusinessCounts[
                    plan as keyof typeof stats.planBusinessCounts
                  ] === 1
                    ? ""
                    : "es"}
                </div>
              </div>
              <div className="admin-plan-count">
                {count} vendor{count === 1 ? "" : "s"}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <h2>Vendors by State</h2>
          {stats.locationData.length === 0 ? (
            <p style={{ color: "#667085", fontSize: "0.86rem" }}>
              No location data yet.
            </p>
          ) : (
            stats.locationData.map((item) => (
              <div className="admin-location-row" key={item.state}>
                <span className="admin-location-label">{item.state}</span>
                <div className="admin-location-bar-track">
                  <div
                    className="admin-location-bar-fill"
                    style={{ width: `${(item.count / maxStateCount) * 100}%` }}
                  />
                </div>
                <span className="admin-location-count">{item.count}</span>
              </div>
            ))
          )}
        </div>

        <div className="admin-panel">
          <h2>Vendor Distribution</h2>
          {stats.locationData.length === 0 ? (
            <p style={{ color: "#667085", fontSize: "0.86rem" }}>
              No location data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.locationData}
                  dataKey="count"
                  nameKey="state"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={(entry) => (entry.payload as { state: string }).state}
                >
                  {stats.locationData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
