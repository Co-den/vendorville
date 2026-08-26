"use client";

import { useAuthStore } from "@/store/authStore";
import api from "@/store/axiosInstance";
import { useBusinessStore } from "@/store/businessStore";
import { Bolt } from 'lucide-react';
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, updatePassword, isLoading } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { businesses } = useBusinessStore();
  const [staff, setStaff] = useState<any[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("staff");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const activeBusinessId = businesses[0]?.id;
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [showIssueGiftCard, setShowIssueGiftCard] = useState(false);
  const [giftCardValue, setGiftCardValue] = useState("");
  const [giftCardError, setGiftCardError] = useState("");
  const [issuedCard, setIssuedCard] = useState<any>(null);
  const [riders, setRiders] = useState<any[]>([]);
  const [showAddRider, setShowAddRider] = useState(false);
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [riderError, setRiderError] = useState("");
  const [zones, setZones] = useState<any[]>([]);
  const [showAddZone, setShowAddZone] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneFee, setZoneFee] = useState("");
  const [zoneError, setZoneError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);

  const addRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setRiderError("");
    try {
      const res = await api.post(`/businesses/${activeBusinessId}/riders`, {
        name: riderName,
        phone: riderPhone,
      });
      setRiders((prev) => [...prev, res.data.rider]);
      setShowAddRider(false);
      setRiderName("");
      setRiderPhone("");
    } catch (err: any) {
      setRiderError(err.response?.data?.message || "Could not add rider");
    }
  };
  const issueGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setGiftCardError("");
    try {
      const res = await api.post(`/businesses/${activeBusinessId}/gift-cards`, {
        value: Number(giftCardValue),
      });
      setGiftCards((prev) => [...prev, res.data.card]);
      setIssuedCard(res.data.card);
      setShowIssueGiftCard(false);
      setGiftCardValue("");
    } catch (err: any) {
      setGiftCardError(
        err.response?.data?.message || "Could not issue gift card",
      );
    }
  };

  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/staff`)
        .then((res) => setStaff(res.data.staff));
    }
  }, [activeBusinessId]);

  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/gift-cards`)
        .then((res) => setGiftCards(res.data.cards))
        .catch(() => {});
    }
  }, [activeBusinessId]);

  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/riders`)
        .then((res) => setRiders(res.data.riders))
        .catch(() => {});
    }
  }, [activeBusinessId]);

  const inviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    try {
      const res = await api.post(`/businesses/${activeBusinessId}/staff`, {
        name: staffName,
        email: staffEmail,
        role: staffRole,
        tempPassword: staffPassword,
      });
      setStaff((prev) => [...prev, res.data.staff]);
      setInviteSuccess({ email: staffEmail, tempPassword: staffPassword });
      setShowInvite(false);
      setStaffName("");
      setStaffEmail("");
      setStaffPassword("");
    } catch (err: any) {
      setStaffError(
        err.response?.data?.message || "Could not add staff member",
      );
    }
  };

  const removeStaffMember = async (staffId: number) => {
    await api.delete(`/businesses/${activeBusinessId}/staff/${staffId}`);
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    try {
      const response = await updatePassword(currentPassword, newPassword);
      setPasswordSuccess(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Could not update password.",
      );
    }
  };
  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/delivery-zones`)
        .then((res) => setZones(res.data.zones))
        .catch(() => {});
    }
  }, [activeBusinessId]);

  const addZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setZoneError("");
    try {
      const res = await api.post(
        `/businesses/${activeBusinessId}/delivery-zones`,
        { name: zoneName, fee: Number(zoneFee) },
      );
      setZones((prev) => [...prev, res.data.zone]);
      setShowAddZone(false);
      setZoneName("");
      setZoneFee("");
    } catch (err: any) {
      setZoneError(err.response?.data?.message || "Could not add zone");
    }
  };

  const removeZone = async (zoneId: number) => {
    await api.delete(
      `/businesses/${activeBusinessId}/delivery-zones/${zoneId}`,
    );
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
  };
  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <Bolt size={25} strokeWidth={2.5} />
          </span>
          <span>SETTINGS</span>
        </div>
        <h1>
          Manage your <span>account</span>.
        </h1>
        <p>Update your profile and security settings.</p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <h2>Profile</h2>
        </div>
        <div className="field-row-2">
          <div className="field-group">
            <label className="field-label">First Name</label>
            <input type="text" value={user?.firstName || ""} disabled />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>
        </div>
        <p className="field-hint">
          To update your name or email, please contact support self-service
          profile editing is coming soon.
        </p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="modal-field">
            <label>Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-row-2">
            <div className="modal-field">
              <label>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {passwordError && (
            <div className="error-message" style={{ marginBottom: 14 }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: "0.86rem",
                marginBottom: 14,
              }}
            >
              {passwordSuccess}
            </div>
          )}

          <button type="submit" className="btn-create" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>Team Members</h2>
          <button className="biz-add-btn" onClick={() => setShowInvite(true)}>
            Add Staff
          </button>
        </div>
        {staff.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No team members yet.
          </p>
        ) : (
          staff.map((s) => (
            <div className="stock-row" key={s.id}>
              <div>
                <div className="stock-name">
                  {s.name}{" "}
                  <span style={{ fontWeight: 400, color: "var(--gray)" }}>
                    ({s.role})
                  </span>
                </div>
                <div className="stock-sub">{s.email}</div>
              </div>
              <button
                className="icon-btn-small warn"
                onClick={() => removeStaffMember(s.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>
            Dispatch Riders{" "}
            <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>
              ✦ Enterprise
            </span>
          </h2>
          <button className="biz-add-btn" onClick={() => setShowAddRider(true)}>
            Add Rider
          </button>
        </div>
        {riders.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No riders added yet.
          </p>
        ) : (
          riders.map((r) => (
            <div className="stock-row" key={r.id}>
              <div>
                <div className="stock-name">{r.name}</div>
                <div className="stock-sub">{r.phone}</div>
              </div>
              <span
                className="stock-badge"
                style={{
                  color: r.isActive ? "var(--accent)" : "#dc2626",
                  background: r.isActive ? "var(--accent-light)" : "#fee2e2",
                }}
              >
                {r.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))
        )}
      </div>

      {showAddRider && (
        <div className="modal-overlay" onClick={() => setShowAddRider(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Rider</h3>
            <form onSubmit={addRider}>
              <div className="modal-field">
                <label>Name</label>
                <input
                  required
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Phone</label>
                <input
                  type="tel"
                  required
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                />
              </div>
              {riderError && <div className="error-message">{riderError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => setShowAddRider(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-modal">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Team Member</h3>
            <form onSubmit={inviteStaff}>
              <div className="modal-field">
                <label>Name</label>
                <input
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                >
                  <option value="staff">Staff (Orders & Inventory)</option>
                  <option value="manager">
                    Manager (+ Customers & Analytics)
                  </option>
                </select>
              </div>
              <div className="modal-field">
                <label>Temporary Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </div>
              {staffError && <div className="error-message">{staffError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => setShowInvite(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-modal">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {inviteSuccess && (
        <div className="modal-overlay" onClick={() => setInviteSuccess(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Team Member Added</h3>
              <p className="modal-sub">
                Share these login details with {inviteSuccess.email}:
              </p>
              <div
                style={{
                  background: "var(--offwhite)",
                  borderRadius: 10,
                  padding: 16,
                  textAlign: "left",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--gray)",
                    marginBottom: 4,
                  }}
                >
                  Login URL
                </div>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>
                  vendorville.vercel.app/staff/login
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--gray)",
                    marginBottom: 4,
                  }}
                >
                  Email
                </div>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>
                  {inviteSuccess.email}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--gray)",
                    marginBottom: 4,
                  }}
                >
                  Temporary Password
                </div>
                <div style={{ fontWeight: 700 }}>
                  {inviteSuccess.tempPassword}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-primary-modal"
                  style={{ flex: "none", width: "100%" }}
                  onClick={() => setInviteSuccess(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>Delivery Zones</h2>
          <button className="biz-add-btn" onClick={() => setShowAddZone(true)}>
            Add Zone
          </button>
        </div>
        {zones.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No delivery zones yet customers won't be able to select a delivery
            area at checkout until you add one.
          </p>
        ) : (
          zones.map((z) => (
            <div className="stock-row" key={z.id}>
              <div className="stock-name">{z.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className="stock-badge"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-light)",
                  }}
                >
                  ₦{z.fee.toLocaleString()}
                </span>
                <button
                  className="icon-btn-small warn"
                  onClick={() => removeZone(z.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddZone && (
        <div className="modal-overlay" onClick={() => setShowAddZone(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Delivery Zone</h3>
            <form onSubmit={addZone}>
              <div className="modal-field">
                <label>Zone Name</label>
                <input
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. New Haven"
                />
              </div>
              <div className="modal-field">
                <label>Delivery Fee (₦)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={zoneFee}
                  onChange={(e) => setZoneFee(e.target.value)}
                />
              </div>
              {zoneError && <div className="error-message">{zoneError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => setShowAddZone(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-modal">
                  Add Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <h2>Gift Cards</h2>
          <button
            className="biz-add-btn"
            onClick={() => setShowIssueGiftCard(true)}
          >
            Issue Gift Card
          </button>
        </div>
        {giftCards.length === 0 ? (
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No gift cards issued yet. Requires Professional plan or higher.
          </p>
        ) : (
          giftCards.map((c) => (
            <div className="stock-row" key={c.id}>
              <div>
                <div className="stock-name">{c.code}</div>
                <div className="stock-sub">
                  ₦{c.remainingValue.toLocaleString()} of ₦
                  {c.initialValue.toLocaleString()} remaining
                </div>
              </div>
              <span
                className="stock-badge"
                style={{
                  color: c.isActive ? "var(--accent)" : "#dc2626",
                  background: c.isActive ? "var(--accent-light)" : "#fee2e2",
                }}
              >
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))
        )}
      </div>

      {showIssueGiftCard && (
        <div
          className="modal-overlay"
          onClick={() => setShowIssueGiftCard(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Issue Gift Card</h3>
            <form onSubmit={issueGiftCard}>
              <div className="modal-field">
                <label>Value (₦)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={giftCardValue}
                  onChange={(e) => setGiftCardValue(e.target.value)}
                />
              </div>
              {giftCardError && (
                <div className="error-message">{giftCardError}</div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={() => setShowIssueGiftCard(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-modal">
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {issuedCard && (
        <div className="modal-overlay" onClick={() => setIssuedCard(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Gift Card Issued</h3>
              <p className="modal-sub">
                Code: <strong>{issuedCard.code}</strong> — ₦
                {issuedCard.initialValue.toLocaleString()}
              </p>
              <div className="modal-actions">
                <button
                  className="btn-primary-modal"
                  style={{ flex: "none", width: "100%" }}
                  onClick={() => setIssuedCard(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
