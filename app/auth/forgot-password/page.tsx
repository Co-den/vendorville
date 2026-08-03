"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useState } from "react";
import "../signup/signup.css";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, message, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
    setSubmitted(true);
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
            <span className="dot"></span>Account Recovery
          </div>
          <h1>
            Forgot Your<span>Password?</span>
          </h1>
          <p className="sub">
            No worries — enter your email and we'll send you a link to reset it.
          </p>
        </div>
      </div>

      <div className="form-panel">
        <div className="auth-card">
          <h2>Reset Password</h2>
          <div className="rule"></div>
          <p className="tagline">We'll email you a secure reset link.</p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "var(--gray, #667085)", fontSize: "0.9rem" }}>
                {message ||
                  "If that email exists, a reset link has been sent. Check your inbox."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "0.84rem",
                    marginBottom: "12px",
                  }}
                >
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
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
