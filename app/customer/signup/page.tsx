"use client";

import { useCustomerAuthStore } from "@/store/customerAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../customer-auth.css";

export default function CustomerSignupPage() {
  const { signup, isLoading, error } = useCustomerAuthStore();
  const router = useRouter();
 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, phone, password });
      router.push("/customer/orders");
    } catch {}
  };

  return (
    <div className="customer-auth-page">
      <div className="customer-auth-card">
        <h1>Create an Account</h1>
        <p>Track your orders and check out faster next time.</p>

        <form onSubmit={handleSubmit}>
          <div className="ca-field">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <label>Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="ca-field">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="ca-error">{error}</div>}
          <button type="submit" className="ca-submit-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="ca-switch">
          Already have an account?{" "}
          <Link
            href={`/auth/customer/login`}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
