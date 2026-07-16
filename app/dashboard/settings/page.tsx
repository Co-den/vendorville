"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export default function SettingsPage() {
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
    </>
  );
}
