"use client";

import { useAuthStore } from "@/store/authStore";
import api from "@/store/axiosInstance";
import { useBusinessStore } from "@/store/businessStore";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { businesses } = useBusinessStore();
  const [staff, setStaff] = useState<any[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("staff");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const activeBusinessId = businesses[0]?.id;

  useEffect(() => {
    if (activeBusinessId) {
      api
        .get(`/businesses/${activeBusinessId}/staff`)
        .then((res) => setStaff(res.data.staff));
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

  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

    setIsSaving(true);
    // TODO: wire to a real POST /api/auth/change-password endpoint once built —
    // this form is UI-complete but not yet connected to the backend.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setPasswordSuccess(
      "This feature is coming soon — password changes aren't wired up yet.",
    );
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>Settings
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

          <button type="submit" className="btn-create" disabled={isSaving}>
            {isSaving ? "Saving..." : "Update Password"}
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
    </>
  );
}
