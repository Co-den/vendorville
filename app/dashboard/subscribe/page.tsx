"use client";

import { useAuthStore } from "@/store/authStore";
import { plans, useSubscriptionStore } from "@/store/subscriptionStore";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const mockInvoices = [
  {
    id: "INV-1042",
    date: "Jun 11, 2026",
    plan: "Professional",
    amount: "₦10,500",
    status: "paid",
  },
  {
    id: "INV-0981",
    date: "May 11, 2026",
    plan: "Professional",
    amount: "₦10,500",
    status: "paid",
  },
  {
    id: "INV-0916",
    date: "Apr 11, 2026",
    plan: "Starter",
    amount: "₦5,500",
    status: "paid",
  },
];

export default function SubscribePage() {
  const { user } = useAuthStore();
  const { plan, renewsAt, isProcessing, setProcessing } =
    useSubscriptionStore();
  const currentPlan = plans[plan as keyof typeof plans];

  const handleSubscribe = (planId: string) => {
    if (planId === plan) return;
    if (!window.PaystackPop) return;

    setProcessing(planId as "starter" | "professional" | "enterprise");

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "vendor@example.com",
      amount: plans[planId as keyof typeof plans].price * 100,
      currency: "NGN",
      ref: `vh_sub_${Date.now()}`,
      callback: () => {
        // In production: verify server-side, then update the subscription record.
        setProcessing(null);
      },
      onClose: () => {
        setProcessing(null);
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>
          Billing & Plans
        </div>
        <h1>
          Manage your <span>subscription</span>.
        </h1>
        <p>Choose the plan that fits how many businesses and stores you run.</p>
      </div>

      <div className="current-plan-card">
        <div className="current-plan-left">
          <div className="current-plan-label">Current Plan</div>
          <div className="current-plan-name">{currentPlan.name}</div>
          <div className="current-plan-meta">
            {currentPlan.businessLimit === Infinity
              ? "Unlimited businesses"
              : `${currentPlan.businessLimit} business${currentPlan.businessLimit === 1 ? "" : "es"}, ${currentPlan.storesPerBusiness} store${currentPlan.storesPerBusiness === 1 ? "" : "s"} per brand`}
            {renewsAt &&
              ` · Renews ${new Date(renewsAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}`}
          </div>
        </div>
        <div className="current-plan-price">
          ₦{currentPlan.price.toLocaleString()}
          <span>/month</span>
        </div>
      </div>

      <div className="plan-grid">
        {Object.values(plans).map((p) => {
          const isCurrent = p.id === plan;
          const isPopular = "popular" in p && (p as any).popular;

          return (
            <div
              className={`plan-card ${isPopular ? "featured" : ""} ${isCurrent ? "current" : ""}`}
              key={p.id}
            >
              {isPopular && <div className="plan-card-badge">Most Popular</div>}
              <div className="plan-card-name">{p.name}</div>
              <div className="plan-card-tagline">{p.tagline}</div>
              <div className="plan-card-price">
                ₦{p.price.toLocaleString()}
                <span>/month</span>
              </div>
              <ul className="plan-card-features">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-card-btn ${isPopular ? "primary" : ""}`}
                disabled={isCurrent || isProcessing === p.id}
                onClick={() => handleSubscribe(p.id)}
              >
                {isCurrent
                  ? "Current Plan"
                  : isProcessing === p.id
                    ? "Processing..."
                    : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Billing History</h2>
        </div>
        {mockInvoices.map((inv) => (
          <div className="invoice-row" key={inv.id}>
            <div>
              <div className="invoice-id">{inv.id}</div>
              <div className="invoice-date">
                {inv.date} · {inv.plan}
              </div>
            </div>
            <div className="invoice-amount">{inv.amount}</div>
            <div className={`order-status ${inv.status}`}>{inv.status}</div>
          </div>
        ))}
      </div>
    </>
  );
}
