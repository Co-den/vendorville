'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import '../verify-code.css'

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Mock email - in production this would come from your auth context/session
  const maskedEmail = 'john****@gmail.com'

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only take last digit

    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock verification - in production, verify with your backend
      if (fullCode === '123456') {
        setSuccess(true)
        // Redirect to dashboard after success
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setError('Invalid verification code. Please try again.')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    setTimeLeft(240)
    setCode(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
    // In production, call resend API here
  }

  if (success) {
    return (
      <div className="verify-page verify-success">
        <div className="verify-container">
          <div className="success-section">
            <div className="success-icon">✓</div>
            <h2>Verification Successful</h2>
            <p>Your account has been verified. Redirecting to dashboard...</p>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="verify-page">
      <div className="verify-container">
        {/* Left Section */}
        <div className="verify-left">
          <div className="system-status">
            <span className="status-dot"></span>
            SYSTEM STATUS: SECURE
          </div>

          <h1 className="verify-headline">
            Secure Your
            <br />
            <span className="accent">Business Data.</span>
          </h1>

          <p className="verify-tagline">
            Two-factor authentication keeps your vendor dashboard and sensitive business information protected from unauthorized access.
          </p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <span>Bank-Grade Security</span>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Instant Verification</span>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <span>Fraud Protection</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="verify-right">
          <div className="verify-card">
            <div className="verify-header">
              <div className="shield-icon">🔐</div>
              <h2>Security Code</h2>
              <p className="verify-subtitle">
                Identity verification required to protect your business assets.
              </p>
            </div>

            <div className="verify-content">
              <div className="verification-label">VERIFICATION DESTINATION</div>
              <div className="email-display">
                <span className="envelope-icon">✉</span>
                {maskedEmail}
              </div>

              <form onSubmit={handleSubmit} className="code-form">
                <div className="code-inputs">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
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
                  className="authenticate-btn"
                  disabled={isSubmitting || code.some(c => c === '')}
                >
                  {isSubmitting ? 'Verifying...' : 'Authenticate Account'}
                </button>
              </form>

              <div className="resend-section">
                <p className="resend-label">Didn't get the code?</p>
                {timeLeft > 0 ? (
                  <div className="timer-info">
                    <span className="timer-text">Check your spam or resend in</span>
                    <div className="timer">{formatTime(timeLeft)}</div>
                  </div>
                ) : (
                  <button className="resend-btn" onClick={handleResend}>
                    Resend Code
                  </button>
                )}
              </div>

              <Link href="/auth/login" className="back-link">
                ← Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
