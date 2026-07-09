'use client'

import { CompleteFormData } from '@/app/auth/signup/schema'
import { useEffect, useRef } from 'react'
import {
    Control,
    Controller,
    FieldErrors,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form'

interface Step4SecurityProps {
  control: Control<CompleteFormData>
  register: UseFormRegister<CompleteFormData>
  errors: FieldErrors<CompleteFormData>
  watch: UseFormWatch<CompleteFormData>
}

export function Step4Security({
  control,
  register,
  errors,
  watch,
}: Step4SecurityProps) {
  const pinInputs = useRef<(HTMLInputElement | null)[]>([])
  const confirmInputs = useRef<(HTMLInputElement | null)[]>([])

  const pin = watch('pin')
  const confirmPin = watch('confirmPin')

  useEffect(() => {
    if (pin?.length && pin.length < 4) {
      pinInputs.current[pin.length]?.focus()
    }
  }, [pin])

  useEffect(() => {
    if (confirmPin?.length && confirmPin.length < 4) {
      confirmInputs.current[confirmPin.length]?.focus()
    }
  }, [confirmPin])

  return (
    <div className="step-content">
      <h2>Security</h2>
      <div className="rule"></div>
      <p className="tagline">Create a PIN to secure your account.</p>

      {/* PIN */}
      <div className="pin-group">
        <label className="pin-label">4-Digit PIN *</label>

        <Controller
          name="pin"
          control={control}
          render={({ field }) => (
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
                  value={field.value?.[index] ?? ''}
                  onChange={(e) => {
                    const digit = e.target.value.replace(/\D/g, '').slice(-1)

                    const values = (field.value || '')
                      .padEnd(4, ' ')
                      .split('')

                    values[index] = digit

                    field.onChange(values.join('').trim())

                    if (digit && index < 3) {
                      pinInputs.current[index + 1]?.focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' &&
                      !field.value?.[index] &&
                      index > 0
                    ) {
                      pinInputs.current[index - 1]?.focus()
                    }
                  }}
                  aria-label={`PIN digit ${index + 1}`}
                />
              ))}
            </div>
          )}
        />

        {errors.pin && (
          <span className="error-text">{errors.pin.message}</span>
        )}
      </div>

      {/* Confirm PIN */}
      <div className="pin-group">
        <label className="pin-label">Confirm PIN *</label>

        <Controller
          name="confirmPin"
          control={control}
          render={({ field }) => (
            <div className="pin-row">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    confirmInputs.current[index] = el
                  }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="•"
                  value={field.value?.[index] ?? ''}
                  onChange={(e) => {
                    const digit = e.target.value.replace(/\D/g, '').slice(-1)

                    const values = (field.value || '')
                      .padEnd(4, ' ')
                      .split('')

                    values[index] = digit

                    field.onChange(values.join('').trim())

                    if (digit && index < 3) {
                      confirmInputs.current[index + 1]?.focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Backspace' &&
                      !field.value?.[index] &&
                      index > 0
                    ) {
                      confirmInputs.current[index - 1]?.focus()
                    }
                  }}
                  aria-label={`Confirm PIN digit ${index + 1}`}
                />
              ))}
            </div>
          )}
        />

        {errors.confirmPin && (
          <span className="error-text">
            {errors.confirmPin.message}
          </span>
        )}
      </div>

      {/* Terms */}
      <div className="field checkbox-field">
        <input
          id="agreeTerms"
          type="checkbox"
          {...register('agreeTerms')}
        />

        <label htmlFor="agreeTerms" className="checkbox-label">
          I agree to the{' '}
          <a href="#terms" className="terms-link">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="terms-link">
            Privacy Policy
          </a>
        </label>
      </div>

      {errors.agreeTerms && (
        <span className="error-text">
          {errors.agreeTerms.message}
        </span>
      )}
    </div>
  )
}