"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
//import "../signup.css";
import "../../signup/signup.css";

export default function ResetPasswordPage() {
  const { resetPassword, isLoading, error } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {}
  };

  return (
    <div className="signup-container">
      <div className="brand-panel">
        <div className="brand-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="brand-overlay" aria-hidden="true"></div>
        <div className="brand-content">
          <div className="status-pill">
            <span className="dot"></span>Almost there
          </div>
          <h1>
            Set a New<span>Password.</span>
          </h1>
          <p className="sub">
            Choose a strong password to keep your VendorVille account secure.
          </p>
        </div>
      </div>

      <div className="form-panel">
        <div className="auth-card">
          <h2>Reset Password</h2>
          <div className="rule"></div>
          <p className="tagline">Enter and confirm your new password.</p>

          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p
                style={{
                  color: "var(--accent, #3a844f)",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                }}
              >
                Password reset! Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {(localError || error) && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "0.84rem",
                    marginBottom: "12px",
                  }}
                >
                  {localError || error}
                </div>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="alt-row">
            <Link href="/auth/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
