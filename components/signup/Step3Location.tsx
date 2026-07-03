'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CompleteFormData } from '@/app/signup/schema'

interface Step3LocationProps {
  register: UseFormRegister<CompleteFormData>
  errors: FieldErrors<CompleteFormData>
}

const nigerianStates = [
  'Lagos',
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT',
]

export function Step3Location({ register, errors }: Step3LocationProps) {
  return (
    <div className="step-content">
      <h2>Business Location</h2>
      <div className="rule"></div>
      <p className="tagline">Where is your business located?</p>

      <div className="field">
        <label htmlFor="state">State *</label>
        <select
          id="state"
          {...register('state')}
          aria-invalid={errors.state ? 'true' : 'false'}
        >
          <option value="">Select state</option>
          {nigerianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && <span className="error-text">{errors.state.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="city">City *</label>
        <input
          id="city"
          type="text"
          placeholder="e.g., Ikeja, Lekki, Surulere"
          {...register('city')}
          aria-invalid={errors.city ? 'true' : 'false'}
        />
        {errors.city && <span className="error-text">{errors.city.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="address">Business Address *</label>
        <input
          id="address"
          type="text"
          placeholder="Street address, building, shop number"
          {...register('address')}
          aria-invalid={errors.address ? 'true' : 'false'}
        />
        {errors.address && <span className="error-text">{errors.address.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          type="text"
          placeholder="Optional"
          {...register('postalCode')}
        />
      </div>
    </div>
  )
}
