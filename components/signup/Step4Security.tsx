'use client'

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import { CompleteFormData } from '@/app/signup/schema'
import { useEffect, useRef } from 'react'

interface Step4SecurityProps {
  register: UseFormRegister<CompleteFormData>
  errors: FieldErrors<CompleteFormData>
  watch: UseFormWatch<CompleteFormData>
}

export function Step4Security({ register, errors, watch }: Step4SecurityProps) {
  const pinInputs = useRef<(HTMLInputElement | null)[]>([])
  const pin = watch('pin')

  // Auto-focus PIN inputs
  useEffect(() => {
    if (pin && pin.length <= 4) {
      const nextIndex = Math.min(pin.length, 3)
      pinInputs.current[nextIndex]?.focus()
    }
  }, [pin])

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    if (value.length > 1) {
      e.target.value = value.slice(-1)
    }
    if (value && index < 3) {
      pinInputs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="step-content">
      <h2>Security</h2>
      <div className="rule"></div>
      <p className="tagline">Create a PIN to secure your account.</p>

      <div className="pin-group">
        <label className="pin-label">4-Digit PIN *</label>
        <div className="pin-row">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => {
                pinInputs.current[index] = el
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              placeholder="•"
              onChange={(e) => handlePinInput(e, index)}
              {...register('pin', {
                onChange: (e) => {
                  const digits = pinInputs.current
                    .map((input) => input?.value || '')
                    .join('')
                    .slice(0, 4)
                  e.target.value = digits
                },
              })}
              aria-label={`PIN digit ${index + 1}`}
            />
          ))}
        </div>
        {errors.pin && <span className="error-text">{errors.pin.message}</span>}
      </div>

      <div className="pin-group">
        <label className="pin-label">Confirm PIN *</label>
        <div className="pin-row">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={`confirm-${index}`}
              type="password"
              inputMode="numeric"
              maxLength={1}
              placeholder="•"
              {...register('confirmPin', {
                onChange: (e) => {
                  const value = e.target.value.replace(/[^\d]/g, '')
                  if (value.length > 1) {
                    e.target.value = value.slice(-1)
                  }
                },
              })}
              aria-label={`Confirm PIN digit ${index + 1}`}
            />
          ))}
        </div>
        {errors.confirmPin && <span className="error-text">{errors.confirmPin.message}</span>}
      </div>

      <div className="field checkbox-field">
        <input
          id="agreeTerms"
          type="checkbox"
          {...register('agreeTerms')}
          aria-invalid={errors.agreeTerms ? 'true' : 'false'}
        />
        <label htmlFor="agreeTerms" className="checkbox-label">
          I agree to the{' '}
          <a href="#terms" className="terms-link">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#privacy" className="terms-link">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreeTerms && <span className="error-text">{errors.agreeTerms.message}</span>}
    </div>
  )
}
