'use client'

import { SignupWizard } from '@/components/signup/SignupWizard'
import './signup.css'

export default function SignupPage() {

  return (
    <div className="signup-container">
      {/* LEFT PANEL — Brand + Background */}
      <div className="brand-panel">
        <div className="brand-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="brand-overlay" aria-hidden="true"></div>
        <div className="brand-content">
          <div className="status-pill">
            <span className="dot"></span>
            Vendor Status: Online
          </div>
          <h1>
            The Future of<span>Vendor Ops.</span>
          </h1>
          <p className="sub">
            Experience the next generation of vendor management. Secure, intelligent,
            and built for scale.
          </p>
          <div className="brand-feats">
            <div className="bf-item">
              <div className="bf-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="bf-label">Cloud Sync</div>
            </div>
            <div className="bf-item">
              <div className="bf-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </div>
              <div className="bf-label">Secure Pay</div>
            </div>
            <div className="bf-item">
              <div className="bf-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="18" x2="12" y2="21" />
                </svg>
              </div>
              <div className="bf-label">AI Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="form-panel">
        <div className="auth-card">
          <SignupWizard />
        </div>
      </div>
    </div>
  )
}
