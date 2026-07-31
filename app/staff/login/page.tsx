"use client";

import "@/app/customer/customer-auth.css";
import { useStaffAuthStore } from "@/store/staffAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffLoginPage() {
  const { login, isLoading, error } = useStaffAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {}
  };

  return (
    <div className="ca-container">
      <div className="ca-brand-panel">
        <div className="ca-brand-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="ca-brand-overlay" aria-hidden="true"></div>
        <div className="ca-brand-content">
          <div className="ca-status-pill">
            <span className="dot"></span>Team Access
          </div>
          <h1>
            Welcome to the <span>Team.</span>
          </h1>
          <p className="ca-sub">
            Log in with your staff credentials to access your assigned business.
          </p>
        </div>
      </div>

      <div className="ca-form-panel">
        <div className="ca-auth-card">
          <h2>Staff Login</h2>
          <div className="ca-rule"></div>
          <p className="ca-tagline">
            Enter the credentials provided by your business owner.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="ca-field">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="ca-field">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="ca-error">{error}</div>}
            <button
              type="submit"
              className="ca-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
