"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../signup/signup.css";
import "../verify-code.css";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}

export default function VerifyCodePage() {
  const { verifyEmail, resendCode } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(240);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/auth/signup");
    }
  }, [email, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await verifyEmail(email, fullCode);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid verification code. Please try again.",
      );
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      await resendCode(email);
      setTimeLeft(240);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Could not resend code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="signup-container">
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
              Verification Complete
            </div>
            <h1>
              Welcome to<span>VendorVille.</span>
            </h1>
            <p className="sub">
              Your account is verified and secure. Redirecting you to your
              dashboard now.
            </p>
          </div>
        </div>

        <div className="form-panel">
          <div className="auth-card verify-success-card">
            <div className="success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Verification Successful</h2>
            <p>Your account has been verified. Redirecting to dashboard...</p>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      {/* LEFT PANEL — Brand + Background, matches signup/login */}
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
            System Status: Secure
          </div>
          <h1>
            Secure Your<span>Business Data.</span>
          </h1>
          <p className="sub">
            Two-factor authentication keeps your vendor dashboard and sensitive
            business information protected from unauthorized access.
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
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </div>
              <div className="bf-label">Bank-Grade Security</div>
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="bf-label">Instant Verification</div>
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
                  <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
                </svg>
              </div>
              <div className="bf-label">Fraud Protection</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form, matches signup/login */}
      <div className="form-panel">
        <div className="auth-card">
          <h2>Security Code</h2>
          <div className="rule"></div>
          <p className="tagline">
            Identity verification required to protect your business assets.
          </p>

          <div className="verification-label">VERIFICATION DESTINATION</div>
          <div className="email-display">
            <span className="envelope-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 6 10-6" />
              </svg>
            </span>
            {email ? maskEmail(email) : "Loading..."}
          </div>

          <form onSubmit={handleSubmit} className="code-form">
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="code-input"
                  placeholder="0"
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || code.some((c) => c === "")}
            >
              {isSubmitting ? "Verifying..." : "Authenticate Account"}
            </button>
          </form>

          <div className="resend-section">
            <div className="resend-text">
              <p className="resend-label">Didn't get the code?</p>
              {timeLeft > 0 && (
                <span className="timer-text">Check your spam or resend in</span>
              )}
            </div>
            {timeLeft > 0 ? (
              <div className="timer">{formatTime(timeLeft)}</div>
            ) : (
              <button
                type="button"
                className="resend-btn"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </div>

          <div className="alt-row">
            <Link href="/auth/login">← Return to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
