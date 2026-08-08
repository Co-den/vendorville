"use client";

import { adminApi } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";

export default function AllBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    adminApi
      .get("/admin/businesses", { params: { status: filter } })
      .then((res) => setBusinesses(res.data.businesses));
  }, [filter]);

  return (
    <div>
      <h1>All Businesses</h1>
      <div className="admin-filter-row">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            className={`admin-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Address</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((biz) => (
            <tr key={biz.id}>
              <td>{biz.name}</td>
              <td>{biz.address}</td>
              <td>
                <span className={`admin-badge ${biz.verificationStatus}`}>
                  {biz.verificationStatus}
                </span>
              </td>
              <td>{new Date(biz.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
