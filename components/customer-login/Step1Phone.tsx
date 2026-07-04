'use client'

import { UseFormRegister, FieldValues, UseFormFormState } from 'react-hook-form'

interface Step1PhoneProps {
  register: UseFormRegister<FieldValues>
  formState: UseFormFormState<FieldValues>
  onSubmit: () => void
  isLoading?: boolean
}

export function Step1Phone({ register, formState: { errors }, onSubmit, isLoading }: Step1PhoneProps) {
  return (
    <div className="step-content">
      <h2>Track Your Orders</h2>
      <div className="rule"></div>
      <p className="tagline">Enter the phone number you used when ordering.</p>

      <div className="field">
        <label>Country Code</label>
        <div className="phone-code-wrapper">
          <select {...register('countryCode')} className="phone-code-select">
            <option value="+234">+234 (Nigeria)</option>
            <option value="+233">+233 (Ghana)</option>
            <option value="+254">+254 (Kenya)</option>
            <option value="+27">+27 (South Africa)</option>
            <option value="+20">+20 (Egypt)</option>
            <option value="+256">+256 (Uganda)</option>
            <option value="+255">+255 (Tanzania)</option>
            <option value="+237">+237 (Cameroon)</option>
            <option value="+225">+225 (Côte d&apos;Ivoire)</option>
            <option value="+221">+221 (Senegal)</option>
            <option value="+212">+212 (Morocco)</option>
            <option value="+251">+251 (Ethiopia)</option>
            <option value="+250">+250 (Rwanda)</option>
            <option value="+265">+265 (Malawi)</option>
            <option value="+260">+260 (Zambia)</option>
            <option value="+267">+267 (Botswana)</option>
            <option value="+264">+264 (Namibia)</option>
          </select>
        </div>
        {errors.countryCode && <span className="error-text">{String(errors.countryCode?.message)}</span>}
      </div>

      <div className="field">
        <label>Phone Number</label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="10-10 digits, no leading 0"
          inputMode="numeric"
          maxLength={10}
        />
        {errors.phone && <span className="error-text">{String(errors.phone?.message)}</span>}
      </div>

      <p className="helper-text">
        Enter without leading 0 — your country code is already selected. Enter 10 digits for +234.
      </p>

      <div className="form-buttons">
        <button type="button" onClick={onSubmit} className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Continue'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <div className="help-section">
        <p>Your account is created by the vendor store. Contact them if you can&apos;t sign in.</p>
      </div>
    </div>
  )
}
