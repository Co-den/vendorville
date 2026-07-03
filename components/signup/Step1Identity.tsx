'use client'

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import { CompleteFormData } from '@/app/signup/schema'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface Step1IdentityProps {
  register: UseFormRegister<CompleteFormData>
  errors: FieldErrors<CompleteFormData>
  watch: UseFormWatch<CompleteFormData>
}

export function Step1Identity({ register, errors, watch }: Step1IdentityProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const password = watch('password')

  return (
    <div className="step-content">
      <h2>Create your account</h2>
      <div className="rule"></div>
      <p className="tagline">Let&apos;s start with your personal information.</p>

      <div className="name-row">
        <div className="field">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            {...register('firstName')}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
          {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register('lastName')}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <div className="field password-field">
        <label htmlFor="password">Password *</label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="error-text">{errors.password.message}</span>}
        <p className="helper-text">Min. 8 characters with uppercase, lowercase, and number</p>
      </div>

      <div className="field password-field">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <div className="password-input-wrapper">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
      </div>
    </div>
  )
}
