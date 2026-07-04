'use client'

import { useEffect, useRef } from 'react'
import { UseFormRegister, FieldValues, UseFormFormState } from 'react-hook-form'

interface Step2PINProps {
  register: UseFormRegister<FieldValues>
  formState: UseFormFormState<FieldValues>
  onSubmit: () => void
  onBack: () => void
  phoneNumber: string
  isLoading?: boolean
}

export function Step2PIN({ register, formState: { errors }, onSubmit, onBack, phoneNumber, isLoading }: Step2PINProps) {
  const pinInputsRef = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    pinInputsRef.current.forEach((input, index) => {
      if (!input) return

      input.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(-1)
        if (this.value && index < pinInputsRef.current.length - 1) {
          pinInputsRef.current[index + 1]?.focus()
        }
      })

      input.addEventListener('keydown', function (e: KeyboardEvent) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
          pinInputsRef.current[index - 1]?.focus()
        }
      })
    })
  }, [])

  return (
    <div className="step-content">
      <h2>Verify Your Identity</h2>
      <div className="rule"></div>
      <p className="tagline">Enter the 4-digit PIN sent to {phoneNumber}</p>

      <div className="pin-group">
        <label className="pin-label">Enter PIN</label>
        <div className="pin-row">
          <input
            type="password"
            inputMode="numeric"
            maxLength={1}
            ref={(el) => {
              if (el) pinInputsRef.current[0] = el
              register('pin').ref?.(el)
            }}
            {...register('pin')}
          />
          <input type="password" inputMode="numeric" maxLength={1} ref={(el) => (el ? (pinInputsRef.current[1] = el) : null)} />
          <input type="password" inputMode="numeric" maxLength={1} ref={(el) => (el ? (pinInputsRef.current[2] = el) : null)} />
          <input type="password" inputMode="numeric" maxLength={1} ref={(el) => (el ? (pinInputsRef.current[3] = el) : null)} />
        </div>
      </div>

      {errors.pin && <span className="error-text">{String(errors.pin?.message)}</span>}

      <div className="form-buttons">
        <button type="button" onClick={onBack} className="btn-secondary" disabled={isLoading}>
          Back
        </button>
        <button type="button" onClick={onSubmit} className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'View Orders'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <div className="resend-section">
        <p>
          Didn&apos;t receive a PIN? <button type="button" className="resend-link">Resend</button>
        </p>
      </div>
    </div>
  )
}
