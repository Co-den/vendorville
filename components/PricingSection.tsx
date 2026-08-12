"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const monthlyPlans = [
  {
    name: "Starter",
    tagline: "Suitable for vendors",
    monthlyPrice: 5500,
    dollarPrice: "4.34",
    vatNote: "after your free trial ends",
    trial: "14 days free trial",
    features: [
      "1 Business, 1 Stall/Front",
      "Up to 200 POS order items/month",
      "Up to 50 orders per customer",
      "Standard POS & Inventory",
      "Up to 50 Customers per store",
      "5 Shelf/Rack Compartments",
      "1 Staff per Store",
      "Email & WhatsApp Sharing",
    ],
    cta: "Start Starter",
    href: "/auth/signup?plan=starter",
    featured: false,
  },
  {
    name: "Professional",
    tagline: "Built for growing vendors",
    monthlyPrice: 10500,
    dollarPrice: "8.28",
    vatNote: "+7.5% VAT",
    features: [
      "2 Businesses, 2 Stores per Brand",
      "Up to 400 POS order items/month",
      "Up to 100 orders per customer",
      "Gift Card & Loyalty Points",
      "Up to 120 Customers per store",
      "15 Shelf/Rack Compartments",
      "3 Staff per Store",
      "Email, SMS & WhatsApp Alerts",
    ],
    cta: "Start Professional",
    href: "/auth/signup?plan=professional",
    featured: true,
  },
  {
    name: "Enterprise Suite",
    tagline: "For enterprise-level vendors",
    monthlyPrice: 15500,
    dollarPrice: "12.22",
    vatNote: "+7.5% VAT",
    features: [
      "Unlimited Businesses & Stalls",
      "Unlimited POS order items",
      "Unlimited orders per store",
      "Unlimited Staff per Store",
      "Unlimited Shelf/Rack Compartments",
      "AI-Powered Order Creation",
      "Dispatch Rider Feature",
      "Email, SMS & WhatsApp Alerts",
    ],
    cta: "Choose Enterprise",
    href: "/auth/signup?plan=enterprise",
    featured: false,
  },
];

const YEARLY_DISCOUNT = 0.8;

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const getDisplayPrice = (monthlyPrice: number) => {
    if (billingCycle === "monthly") return monthlyPrice;

    return Math.round(monthlyPrice * 12 * YEARLY_DISCOUNT);
  };

  return (
    <section id="pricing">
      <div className="wrap">
        <div style={{ textAlign: "center" }}>
          <span className="tag-pill">✦ Pricing</span>
        </div>

        <div className="sec-head reveal">
          <h2>Simple, Transparent Pricing</h2>
          <p>
            Choose the plan that fits how many businesses and stores you run.
          </p>
        </div>

        <div className="toggle">
          <div className="toggle-pill">
            <span
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </span>

            <span
              className={billingCycle === "yearly" ? "active" : ""}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
              <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </div>
        <div className="price-grid reveal-stagger">
          {monthlyPlans.map((plan) => {
            const displayPrice = getDisplayPrice(plan.monthlyPrice);

            return (
              <div
                className={`price-card ${plan.featured ? "pro" : ""}`}
                key={plan.name}
              >
                {" "}
                {plan.trial && <span className="badge-pop">{plan.trial}</span>}
                {plan.featured && (
                  <span className="badge-pop2">MOST POPULAR</span>
                )}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-sub">{plan.tagline}</div>
                <div className="plan-price">
                  ₦{displayPrice.toLocaleString()}
                  <span>/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                <p className="pricing-note">
                  ≈ <span className="price">{plan.dollarPrice}</span> /mo ·
                  incl. VAT
                </p>
                <p className="trial-note">{plan.vatNote}</p>
                {billingCycle === "yearly" ? (
                  <>
                    <p className="pricing-note">Billed yearly</p>

                    <p className="trial-note">
                      Regular price ₦{plan.monthlyPrice.toLocaleString()}/month
                    </p>
                  </>
                ) : (
                  <>
                    <p className="pricing-note">Billed monthly</p>

                    <p className="trial-note">Cancel anytime</p>
                  </>
                )}
                <ul className="plan-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  className={`plan-btn ${plan.trial ? "starter-btn" : ""}`}
                  href={plan.href}
                >
                  {plan.cta}
                </Link>
                <div className="t-badge">
                  <svg
                    className="t-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>

                  <span>No credit card required · Cancel anytime</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
