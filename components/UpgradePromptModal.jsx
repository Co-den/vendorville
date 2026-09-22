// components/UpgradePromptModal.jsx
import { X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import "./upgradePrompt.css";

export default function UpgradePromptModal({ subscription, isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { plan, renewsAt } = useSubscriptionStore();

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

 
  const upgradePlans = {
      starter: {
    id: "starter",
    name: "Starter",
    tagline: "Suitable for vendors",
    price: 5500,
    businessLimit: 1,
    storesPerBusiness: 1,
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
  },

    professional: {
    id: "professional",
    name: "Professional",
    tagline: "Built for growing vendors",
    price: 10500,
    businessLimit: 2,
    storesPerBusiness: 2,
    popular: true,
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
  },
    enterprise: {
        id: "enterprise",
        name: "Enterprise Suite",
        tagline: "For enterprise-level vendors",
        price: 15500,
        businessLimit: Infinity,
        storesPerBusiness: Infinity,
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
      },
  };

  const handleSubscribe = (planId) => {
    if (planId === "enterprise") return;
    if (!window.PaystackPop) return;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: "vendor@example.com",
      amount: upgradePlans[planId].price * 100,
      currency: "NGN",
      ref: `vh_sub_${Date.now()}`,
      callback: () => {
        onClose();
      },
      onClose: () => {},
    });

    handler.openIframe();
  };

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div
        className="upgrade-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="upgrade-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div className="upgrade-modal-header upgrade-modal-header-expired">
          <h2>Your Trial Has Ended</h2>
          <p>Choose a plan to continue using VendorVille and unlock advanced features</p>
        </div>

        {/* Plans Grid - Only Professional & Enterprise */}
        <div className="upgrade-plans-grid upgrade-plans-grid-2col">
          {Object.values(upgradePlans).map((p) => {
            const isPopular = p.popular;

            return (
              <div
                key={p.id}
                className={`upgrade-plan-card ${isPopular ? "featured" : ""}`}
              >
                {isPopular && (
                  <div className="upgrade-plan-badge">MOST POPULAR</div>
                )}

                <h3 className="upgrade-plan-name">{p.name}</h3>
                <p className="upgrade-plan-tagline">{p.tagline}</p>

                <div className="upgrade-plan-price">
                  {p.price ? (
                    <>
                      <span className="price">
                        ₦{p.price.toLocaleString()}
                      </span>
                      <span className="period">{p.period}</span>
                    </>
                  ) : (
                    <span className="price-custom">Custom Pricing</span>
                  )}
                </div>

                <ul className="upgrade-plan-features">
                  {p.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`upgrade-plan-btn ${
                    isPopular ? "primary" : "secondary"
                  }`}
                  onClick={() => handleSubscribe(p.id)}
                >
                  {p.id === "enterprise"
                    ? "Contact Sales"
                    : "Start Subscription"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="upgrade-modal-footer">
          <p>
            Need help choosing? <Link href="/contact">Contact our team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}