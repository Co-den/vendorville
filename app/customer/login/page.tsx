"use client";

import { useCustomerAuthStore } from "@/store/customerAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../customer-auth.css";

export default function CustomerLoginPage() {
  const { login, isLoading, error } = useCustomerAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/customer/orders");
    } catch {}
  };

  return (
    <div className="ca-container">
      {/* LEFT PANEL — Brand + Background */}
      <div className="ca-brand-panel">
        <div className="ca-brand-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="ca-brand-overlay" aria-hidden="true"></div>
        <div className="ca-brand-content">
          <div className="ca-status-pill">
            <span className="dot"></span>
            Shop with confidence
          </div>
          <h1>
            Shop from Vendors <span>You Trust.</span>
          </h1>
          <p className="ca-sub">
            Track your orders, save your details, and check out faster every
            time you shop on VendorVille.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="ca-form-panel">
        <div className="ca-auth-card">
          <h2>Welcome Back</h2>
          <div className="ca-rule"></div>
          <p className="ca-tagline">
            Log in to track your orders and check out faster.
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

          <p className="ca-switch">
            New here? <Link href={`/customer/signup`}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
