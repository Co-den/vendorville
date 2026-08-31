"use client";

import { adminApi } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";
import { Users, Check } from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const planLabels = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
} as const;

type PlanKey = keyof typeof planLabels;

type Stats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  planCounts: Record<PlanKey, number>;
  planBusinessCounts: Record<PlanKey, number>;
  totalSubscriptionRevenue: number;
  locationData: Array<{
    state: string;
    count: number;
  }>;
  topSellingVendor?: {
    name: string;
    totalSales: number;
  };
  topVendorState: string;
};

const defaultStats: Stats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  planCounts: {
    starter: 0,
    professional: 0,
    enterprise: 0,
  },
  planBusinessCounts: {
    starter: 0,
    professional: 0,
    enterprise: 0,
  },
  totalSubscriptionRevenue: 0,
  locationData: [],
  topSellingVendor: undefined,
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

const defaultExpandedSections = {
  stats: true,
  performers: true,
  subscriptions: true,
  locations: true,
  distribution: true,
} as const;

type SectionKey = keyof typeof defaultExpandedSections;

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >(defaultExpandedSections);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const response = await adminApi.get("/admin/stats");

        if (!mounted) return;

        const incomingStats = response.data?.stats || {};

        setStats({
          ...defaultStats,
          ...incomingStats,
          planCounts: {
            ...defaultStats.planCounts,
            ...(incomingStats.planCounts || {}),
          },
          planBusinessCounts: {
            ...defaultStats.planBusinessCounts,
            ...(incomingStats.planBusinessCounts || {}),
          },
          locationData: Array.isArray(incomingStats.locationData)
            ? incomingStats.locationData
            : [],
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) {
    return (
      <>
        <div className="admin-loading">
          <div className="loading-spinner" />
          <span>Loading dashboard...</span>
        </div>
      </>
    );
  }

  const maxStateCount = Math.max(
    ...stats.locationData.map((item) => item.count),
    1,
  );

  const totalSubscriptions = Object.values(stats.planCounts).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="dashboard-greeting">
            <div className="greeting-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <h1>Hello, Admin</h1>
            <p>Let&apos;s help some Vendors today</p>
          </div>
        </div>
        <div className="dashboard-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("stats")}
          >
            <h2>Key Metrics</h2>
            <svg
              className={`toggle-icon ${expandedSections.stats ? "open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {expandedSections.stats && (
            <div className="dashboard-grid">
              {/* Total */}
              <div className="metric-card">
                <div className="metric-icon total">
                  <Users size={25} color="green"/>
                </div>
                <div className="metric-info">
                  <div className="metric-label">Total Businesses</div>
                  <div className="metric-value">{stats.total}</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon pending">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="metric-info">
                  <div className="metric-label">Pending Review</div>
                  <div className="metric-value pending">{stats.pending}</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon approved">
                  <Check/>
                </div>
                <div className="metric-info">
                  <div className="metric-label">Approved</div>
                  <div className="metric-value approved">{stats.approved}</div>
                </div>
              </div>
              {/* Rejected */}
              <div className="metric-card">
                <div className="metric-icon rejected">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>

                <div className="metric-info">
                  <div className="metric-label">Rejected</div>
                  <div className="metric-value rejected">{stats.rejected}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="dashboard-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("performers")}
          >
            <h2>Top Performers</h2>

            <svg
              className={`toggle-icon ${
                expandedSections.performers ? "open" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {expandedSections.performers && (
            <div className="performers-grid">
              <div className="performer-card">
                <div className="performer-label">Top Selling Vendor</div>

                <div className="performer-value">
                  {stats.topSellingVendor?.name || "N/A"}
                </div>

                {stats.topSellingVendor && (
                  <div className="performer-sub">
                    ₦
                    {Number(
                      stats.topSellingVendor.totalSales || 0,
                    ).toLocaleString()}{" "}
                    in sales
                  </div>
                )}
              </div>

              <div className="performer-card revenue-card">
                <div className="performer-label">Revenue</div>

                <div className="performer-value large">
                  ₦
                  {Number(stats.totalSubscriptionRevenue || 0).toLocaleString()}
                </div>

                <div className="performer-sub">
                  Monthly Subscription Revenue
                </div>
              </div>

              <div className="performer-card">
                <div className="performer-label">State with Most Vendors</div>

                <div className="performer-value">
                  {stats.topVendorState || "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subscriptions */}
        <div className="dashboard-section">
          <button
            type="button"
            className="section-header"
            onClick={() => toggleSection("subscriptions")}
          >
            <div className="section-title-wrapper">
              <h2>Subscriptions by Plan</h2>

              <span className="badge-count">{totalSubscriptions}</span>
            </div>

            <svg
              className={`toggle-icon ${
                expandedSections.subscriptions ? "open" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {expandedSections.subscriptions && (
            <div className="subscription-list">
              {(Object.keys(planLabels) as PlanKey[]).map((plan) => {
                const count = stats.planCounts[plan] || 0;
                const businessCount = stats.planBusinessCounts[plan] || 0;

                return (
                  <div className="subscription-row" key={plan}>
                    <div className="subscription-info">
                      <div className="subscription-name">
                        {planLabels[plan]}
                      </div>

                      <div className="subscription-sub">
                        {businessCount} business
                        {businessCount === 1 ? "" : "es"}
                      </div>
                    </div>

                    <div className="subscription-count">
                      {count} vendor{count === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Locations + Distribution */}
        <div className="dashboard-grid-2">
          {/* Vendors by State */}
          <div className="dashboard-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection("locations")}
            >
              <h2>Vendors by State</h2>

              <svg
                className={`toggle-icon ${
                  expandedSections.locations ? "open" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSections.locations && (
              <div className="location-list">
                {stats.locationData.length === 0 ? (
                  <p className="empty-message">No location data yet.</p>
                ) : (
                  stats.locationData.map((item) => (
                    <div className="location-row" key={item.state}>
                      <span className="location-label">{item.state}</span>

                      <div className="location-bar-track">
                        <div
                          className="location-bar-fill"
                          style={{
                            width: `${(item.count / maxStateCount) * 100}%`,
                          }}
                        />
                      </div>

                      <span className="location-count">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Distribution Chart */}
          <div className="dashboard-section">
            <button
              type="button"
              className="section-header"
              onClick={() => toggleSection("distribution")}
            >
              <h2>Vendor Distribution</h2>

              <svg
                className={`toggle-icon ${
                  expandedSections.distribution ? "open" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSections.distribution && (
              <div className="chart-container">
                {stats.locationData.length === 0 ? (
                  <p className="empty-message">No location data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.locationData}
                        dataKey="count"
                        nameKey="state"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        label={(entry: {
                          payload?: { state?: string };
                          name?: string;
                        }) => entry.payload?.state ?? entry.name ?? ""}
                      >
                        {stats.locationData.map((item, index) => (
                          <Cell
                            key={`${item.state}-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
