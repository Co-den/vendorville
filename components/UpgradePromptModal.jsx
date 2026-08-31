// components/UpgradePromptModal.jsx
import { X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./upgradePrompt.css";

export default function UpgradePromptModal({ subscription, isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const plans = {
    starter: {
      name: "Starter",
      price: "₦5,500",
      period: "per month",
      features: [
        "1 staff member",
        "Inventory management",
        "Order & sales tracking",
        "Basic reporting",
      ],
    },
    professional: {
      name: "Professional",
      price: "₦10,500",
      period: "per month",
      features: [
        "3 staff members",
        "Everything in Starter +",
        "Dispatch tracking",
        "Loyalty programs",
        "Advanced analytics",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      features: [
        "Unlimited staff",
        "Everything in Professional +",
        "Custom integrations",
        "Dedicated support",
        "Advanced automation",
      ],
    },
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

        <div className="upgrade-modal-header">
          <h2>Upgrade Your Plan</h2>
          <p>
            Your trial has ended. Choose a plan to continue using VendorVille
          </p>
        </div>

        <div className="upgrade-plans-grid">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`upgrade-plan-card ${
                key === "professional" ? "featured" : ""
              }`}
            >
              {key === "professional" && (
                <div className="upgrade-plan-badge">MOST POPULAR</div>
              )}

              <h3 className="upgrade-plan-name">{plan.name}</h3>

              <div className="upgrade-plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>

              <ul className="upgrade-plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <CheckCircle size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`upgrade-plan-btn ${
                  key === "professional" ? "primary" : "secondary"
                }`}
              >
                {key === "enterprise" ? "Contact Sales" : "Choose Plan"}
              </Link>
            </div>
          ))}
        </div>

        <div className="upgrade-modal-footer">
          <p>
            Not sure which plan is right for you?
            <Link href="/contact"> Contact our team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
