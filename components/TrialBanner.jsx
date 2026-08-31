// components/TrialBanner.jsx
import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./trialBanner.css";

export default function TrialBanner({ subscription }) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [percentageRemaining, setPercentageRemaining] = useState(0);

  useEffect(() => {
    if (!subscription || !subscription.trialEndsAt) return;

    const now = new Date();
    const trialEnd = new Date(subscription.trialEndsAt);
    const daysLeft = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );
    const percentage = (daysLeft / 14) * 100;

    setDaysRemaining(Math.max(0, daysLeft));
    setPercentageRemaining(Math.max(0, percentage));
  }, [subscription]);

  // Don't show if not in trial or no trial info
  if (!subscription || subscription.status !== "trial" || daysRemaining <= 0) {
    return null;
  }

  const isUrgent = daysRemaining <= 3;

  return (
    <div
      className={`trial-banner ${isUrgent ? "urgent" : "normal"}`}
      role="alert"
    >
      <div className="trial-banner-content">
        <div className="trial-banner-icon">
          <Clock size={20} />
        </div>

        <div className="trial-banner-text">
          <h3 className="trial-banner-title">
            Your trial ends in {daysRemaining} day
            {daysRemaining !== 1 ? "s" : ""}
          </h3>
          <p className="trial-banner-subtitle">
            Upgrade now to unlock all features and continue managing your
            business without interruption.
          </p>

          {/* Progress Bar */}
          <div className="trial-progress-bar">
            <div
              className="trial-progress-fill"
              style={{ width: `${percentageRemaining}%` }}
            ></div>
          </div>
          <span className="trial-progress-text">
            {daysRemaining} of 14 days remaining
          </span>
        </div>

        <div className="trial-banner-actions">
          <Link href="/pricing" className="trial-upgrade-btn">
            Upgrade Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
