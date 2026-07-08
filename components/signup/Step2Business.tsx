'use client'

import { CompleteFormData } from '@/app/signup/schema'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

interface Step2BusinessProps {
  register: UseFormRegister<CompleteFormData>
  errors: FieldErrors<CompleteFormData>
}

const countries = [
  { value: 'NG', label: 'NG   Nigeria' },
  { value: 'GH', label: 'GH   Ghana' },
  { value: 'KE', label: 'KE   Kenya' },
  { value: 'ZA', label: 'ZA   South Africa' },
  { value: 'EG', label: 'EG   Egypt' },
  { value: 'UG', label: 'UG   Uganda' },
  { value: 'TZ', label: 'TZ   Tanzania' },
  { value: 'CM', label: 'CM   Cameroon' },
  { value: 'CI', label: 'CI   Côte d\'Ivoire' },
  { value: 'SN', label: 'SN   Senegal' },
  { value: 'MA', label: 'MA   Morocco' },
  { value: 'ET', label: 'ET   Ethiopia' },
  { value: 'RW', label: 'RW   Rwanda' },
  { value: 'MW', label: 'MW   Malawi' },
  { value: 'ZM', label: 'ZM   Zambia' },
]

const timezones = [
  { value: 'Africa/Lagos', label: 'Africa/Lagos (GMT+1)' },
  { value: 'Africa/Accra', label: 'Africa/Accra (GMT+0)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (GMT+2)' },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (GMT+2)' },
  { value: 'Africa/Kampala', label: 'Africa/Kampala (GMT+3)' },
  { value: 'Africa/Dar_es_Salaam', label: 'Africa/Dar es Salaam (GMT+3)' },
  { value: 'Africa/Douala', label: 'Africa/Douala (GMT+1)' },
  { value: 'Africa/Dakar', label: 'Africa/Dakar (GMT+0)' },
  { value: 'Africa/Casablanca', label: 'Africa/Casablanca (GMT+0)' },
  { value: 'Africa/Addis_Ababa', label: 'Africa/Addis Ababa (GMT+3)' },
  { value: 'Africa/Kigali', label: 'Africa/Kigali (GMT+2)' },
]

const businessTypes = [
  'Retail Store',
  'Market Vendor',
  'Wholesale',
  'Restaurant/Food',
  'Electronics',
  'Clothing/Fashion',
  'Groceries',
  'Pharmacy',
  'Hardware',
  'Other',
]

export function Step2Business({ register, errors }: Step2BusinessProps) {
  return (
    <div className="step-content">
      <h2>Business Details</h2>
      <div className="rule"></div>
      <p className="tagline">Tell us about your business.</p>

      <div className="field">
        <label htmlFor="phoneNumber">Phone Number *</label>
        <input
          id="phoneNumber"
          type="tel"
          placeholder="+234 XXX XXX XXXX"
          {...register('phoneNumber')}
          aria-invalid={errors.phoneNumber ? 'true' : 'false'}
        />
        {errors.phoneNumber && <span className="error-text">{errors.phoneNumber.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="businessName">Business Name *</label>
        <input
          id="businessName"
          type="text"
          placeholder="Your Business Name"
          {...register('businessName')}
          aria-invalid={errors.businessName ? 'true' : 'false'}
        />
        {errors.businessName && <span className="error-text">{errors.businessName.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="businessType">Business Type *</label>
        <select
          id="businessType"
          {...register('businessType')}
          aria-invalid={errors.businessType ? 'true' : 'false'}
        >
          <option value="">Select business type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.businessType && <span className="error-text">{errors.businessType.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="country">Country *</label>
        <div className="select-wrap">
          <select
            id="country"
            {...register('country')}
            aria-invalid={errors.country ? 'true' : 'false'}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {errors.country && <span className="error-text">{errors.country.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="timezone">Timezone *</label>
        <div className="timezone-box">
          <div className="timezone-head">
            <span className="timezone-title">🌍 TIMEZONE</span>
            <span className="timezone-badge">IMPORTANT</span>
          </div>
          <div className="select-wrap">
            <select
              id="timeZone"
              {...register('timeZone')}
              aria-invalid={errors.timeZone ? 'true' : 'false'}
            >
              <option value="">Select timezone</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {errors.timeZone && <span className="error-text">{errors.timeZone.message}</span>}
          <p className="timezone-note">Your timezone helps us schedule reports and alerts correctly.</p>
        </div>
      </div>
    </div>
  )
}
