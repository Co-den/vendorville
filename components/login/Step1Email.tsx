'use client'

import { CompleteLoginData } from '@/app/auth/login/schema'
import { useFormContext } from 'react-hook-form'

export function Step1Email() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompleteLoginData>()

  return (
    <div className="step-content">
      <h2>Identity Entry</h2>
      <div className="rule"></div>
      <p className="tagline">Access your secure operations suite.</p>

      <div className="field">
        <label>Business Identity</label>
        <input
          type="email"
          placeholder="name@business.com"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <p className="helper-text">
        Enter the email address associated with your VendorVille business account.
      </p>
    </div>
  )
}
