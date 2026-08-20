"use client";

import { customerApi, useCustomerAuthStore } from "@/store/customerAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../customer-auth.css";

export default function CustomerOrdersPage() {
  const { customer, isAuthenticated, isCheckingAuth, checkAuth, logout } =
    useCustomerAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/customer/login");
    }
  }, [isCheckingAuth, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      customerApi
        .get("/store/customer/orders")
        .then((res) => {
          setOrders(res.data.orders);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  if (isCheckingAuth || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.5rem",
            }}
          >
            Hi, {customer?.name}
          </h1>
          <p style={{ color: "var(--gray)", fontSize: "0.86rem" }}>
            Your order history
          </p>
        </div>
        <button
          className="ca-submit-btn"
          style={{ width: "auto", padding: "10px 18px" }}
          onClick={() => {
            logout();
            router.push("/discover");
          }}
        >
          Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <p
          style={{
            color: "var(--gray)",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          No orders yet.
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 14,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{order.orderNumber}</strong>
                <div style={{ fontSize: "0.84rem", color: "var(--gray)" }}>
                  <Link href={`/store/${order.businessSlug}`}>
                    {order.businessName}
                  </Link>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>
                  ₦{order.totalAmount.toLocaleString()}
                </div>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {order.status !== "cancelled" && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid var(--line)",
                }}
              >
                <Link
                  href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(customer?.phone || "")}`}
                  className="ca-submit-btn"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "block",
                    textDecoration: "none",
                    padding: "10px",
                  }}
                >
                  Track My Order
                </Link>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
