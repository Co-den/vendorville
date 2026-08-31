// components/StaffLimitWarning.jsx
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import "./staffLimitWarning.css";

export default function StaffLimitWarning({ subscription, staffCount }) {
  if (!subscription) return null;

  const limits = {
    starter: 1,
    professional: 3,
    enterprise: Infinity,
  };

  const limit = limits[subscription.plan];
  const isAtLimit = staffCount >= limit;
  const canAddMore = staffCount < limit;

  if (!isAtLimit) return null;

  return (
    <div className="staff-limit-warning">
      <div className="staff-limit-icon">
        <AlertCircle size={20} />
      </div>
      <div className="staff-limit-content">
        <h4 className="staff-limit-title">Staff Limit Reached</h4>
        <p className="staff-limit-text">
          Your {subscription.plan} plan allows up to{" "}
          <strong>
            {limit} staff member{limit !== 1 ? "s" : ""}
          </strong>
          . You've reached the limit.
        </p>
        <div className="staff-limit-plans">
          <p className="staff-limit-plans-title">Add more staff with:</p>
          <ul className="staff-limit-plans-list">
            {subscription.plan !== "professional" && (
              <li>
                <strong>Professional Plan</strong> - 3 staff members
              </li>
            )}
            {subscription.plan !== "enterprise" && (
              <li>
                <strong>Enterprise Plan</strong> - Unlimited staff
              </li>
            )}
          </ul>
        </div>
        <Link href="/pricing" className="staff-limit-upgrade-btn">
          View Plans
        </Link>
      </div>
    </div>
  );
}
