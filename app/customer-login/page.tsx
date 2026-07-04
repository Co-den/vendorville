'use client'

import Link from 'next/link'
import './customer-login.css'
import { CustomerLoginWizard } from '@/components/customer-login/CustomerLoginWizard'

export default function CustomerLoginPage() {
  return (
    <div className="customer-login-container">
      {/* LEFT PANEL — Brand + Background */}
      <div className="brand-panel">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>

        <div className="brand-content">
          <div className="brand-logo">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </div>

          <h1>Track Your <span className="accent">Orders</span></h1>
          <p className="brand-tagline">Orders, payments, delivery status — all in one place.</p>

          <div className="brand-features">
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="6" width="14" height="11" rx="1" />
                <path d="M15 9h4l3 3v5h-7z" />
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="19" r="2" />
              </svg>
              <span>Real-time Tracking</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span>Order Alerts</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <path d="M12 1v6m0 6v6" />
                <path d="M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24" />
                <path d="M1 12h6m6 0h6" />
                <path d="M4.22 19.78l4.24-4.24m2.12-2.12l4.24-4.24" />
              </svg>
              <span>Safe & Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="form-panel">
        <div className="customer-card">
          <CustomerLoginWizard />

          <div className="footer-links">
            <p>
              Looking for your business account? <Link href="/login">Sign in here</Link>
            </p>
            <p className="copyright">© 2026 VendorHub Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  )
}
