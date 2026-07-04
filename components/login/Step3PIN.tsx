'use client'

import { useRef, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { CompleteLoginData } from '@/app/login/schema'

export function Step3PIN() {
  const pinInputsRef = useRef<HTMLInputElement[]>([])
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteLoginData>()

  useEffect(() => {
    pinInputsRef.current.forEach((input, index) => {
      if (!input) return

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        target.value = target.value.replace(/\D/g, '').slice(-1)

        if (target.value && index < pinInputsRef.current.length - 1) {
          pinInputsRef.current[index + 1]?.focus()
        }

        // Update form value
        const pinArray = pinInputsRef.current.map((inp) => inp.value)
        setValue('pin', pinArray.join(''))
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && !target.value && index > 0) {
          pinInputsRef.current[index - 1]?.focus()
        }
      }

      input.addEventListener('input', handleInput)
      input.addEventListener('keydown', handleKeyDown)

      return () => {
        input.removeEventListener('input', handleInput)
        input.removeEventListener('keydown', handleKeyDown)
      }
    })
  }, [setValue])

  return (
    <div className="step-content">
      <h2>Security Verification</h2>
      <div className="rule"></div>
      <p className="tagline">Enter your 4-digit PIN to complete login.</p>

      <div className="field">
        <label>Enter 4-Digit PIN</label>
        <div className="pin-row">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) pinInputsRef.current[index] = el
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              {...register('pin')}
              aria-invalid={!!errors.pin}
              className={errors.pin ? 'error' : ''}
            />
          ))}
        </div>
        {errors.pin && <span className="error-text">{errors.pin.message}</span>}
      </div>

      <p className="helper-text">
        Your PIN provides an extra layer of security to access your VendorHub account.
      </p>
    </div>
  )
}
