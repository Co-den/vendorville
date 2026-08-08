"use client";

import { adminApi } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";

export default function PendingBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadPending = () => {
    setIsLoading(true);
    adminApi
      .get("/admin/businesses/pending")
      .then((res) => {
        setBusinesses(res.data.businesses);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: number) => {
    await adminApi.post(`/admin/businesses/${id}/approve`);
    loadPending();
  };

  const handleReject = async (id: number) => {
    if (!rejectReason.trim()) return;
    await adminApi.post(`/admin/businesses/${id}/reject`, {
      reason: rejectReason,
    });
    setRejectingId(null);
    setRejectReason("");
    loadPending();
  };

  if (isLoading) return <div className="admin-loading">Loading...</div>;

  return (
    <div>
      <h1>Pending Approvals</h1>
      <p className="admin-sub">
        {businesses.length} business{businesses.length === 1 ? "" : "es"}{" "}
        awaiting review
      </p>

      {businesses.length === 0 ? (
        <div className="admin-empty">No pending businesses right now.</div>
      ) : (
        businesses.map((biz) => (
          <div className="admin-card" key={biz.id}>
            <div className="admin-card-header">
              <div className="admin-card-logo">
                {biz.logoUrl ? (
                  <img src={biz.logoUrl} alt={biz.name} />
                ) : (
                  biz.name[0]
                )}
              </div>
              <div>
                <h3>{biz.name}</h3>
                <p>{biz.address}</p>
              </div>
            </div>

            <div className="admin-card-details">
              <div>
                <strong>Description:</strong>{" "}
                {biz.description || "None provided"}
              </div>
              <div>
                <strong>WhatsApp:</strong> {biz.whatsappNumber || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {biz.businessEmail || "N/A"}
              </div>
              <div>
                <strong>Started:</strong> {biz.startedDate || "N/A"}
              </div>
            </div>

            {biz.premisesImages?.length > 0 && (
              <div className="admin-image-row">
                {biz.premisesImages.map((url: string, i: number) => (
                  <img key={i} src={url} alt={`Premises ${i + 1}`} />
                ))}
              </div>
            )}

            {rejectingId === biz.id ? (
              <div className="admin-reject-form">
                <textarea
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="admin-actions">
                  <button
                    className="admin-btn-secondary"
                    onClick={() => setRejectingId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="admin-btn-danger"
                    onClick={() => handleReject(biz.id)}
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-actions">
                <button
                  className="admin-btn-danger"
                  onClick={() => setRejectingId(biz.id)}
                >
                  Reject
                </button>
                <button
                  className="admin-btn-primary"
                  onClick={() => handleApprove(biz.id)}
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
