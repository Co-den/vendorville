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
      router.push( "/customer/orders");
    } catch {}
  };

  return (
    <div className="customer-auth-page">
      <div className="customer-auth-card">
        <h1>Welcome Back</h1>
        <p>Log in to track your orders and check out faster.</p>

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
          <button type="submit" className="ca-submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="ca-switch">
          New here?{" "}
          <Link
            href={`/customer/signup`}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
