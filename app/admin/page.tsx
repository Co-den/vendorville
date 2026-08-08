"use client";

import { adminApi } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    adminApi
      .get("/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Overview</h1>
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
    </div>
  );
}
