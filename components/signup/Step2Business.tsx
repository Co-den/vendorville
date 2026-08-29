'use client'

import { CompleteFormData } from '@/app/auth/signup/schema'
import  SearchableSelect  from "@/components/SearchSelect"
import {
  Control,
  FieldErrors,
  UseFormRegister,
   Controller
} from "react-hook-form";


interface Step2BusinessProps {
  register: UseFormRegister<CompleteFormData>;
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const countries = [
  { value: "NG", label: "NG - Nigeria" },
  { value: "GH", label: "GH - Ghana" },
  { value: "KE", label: "KE - Kenya" },
  { value: "ZA", label: "ZA - South Africa" },
  { value: "EG", label: "EG - Egypt" },
  { value: "UG", label: "UG - Uganda" },
  { value: "TZ", label: "TZ - Tanzania" },
  { value: "CM", label: "CM - Cameroon" },
  { value: "CI", label: "CI - Côte d'Ivoire" },
  { value: "SN", label: "SN - Senegal" },
  { value: "MA", label: "MA - Morocco" },
  { value: "ET", label: "ET - Ethiopia" },
  { value: "RW", label: "RW - Rwanda" },
  { value: "MW", label: "MW - Malawi" },
  { value: "ZM", label: "ZM - Zambia" },
];

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
const businessTypeOptions = businessTypes.map((type) => ({
  value: type,
  label: type,
}));
export function Step2Business({
  register,
  control,
  errors,
}: Step2BusinessProps) {
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

  <Controller
    name="businessType"
    control={control}
    render={({ field }) => (
      <SearchableSelect
        value={field.value}
        onChange={field.onChange}
        options={businessTypeOptions}
        placeholder="Select business type"
      />
    )}
  />

  {errors.businessType && (
    <span className="error-text">
      {errors.businessType.message}
    </span>
  )}
</div>
      <div className="field">
  <label htmlFor="country">Country *</label>

  <Controller
  name="country"
  control={control}
  render={({ field }) => (
    <SearchableSelect
      value={field.value}
      onChange={field.onChange}
      options={countries}
      placeholder="Select country"
    />
  )}
/>

  {errors.country && (
    <span className="error-text">
      {errors.country.message}
    </span>
  )}
</div>

      <div className="field">
  <label htmlFor="timeZone">Timezone *</label>

  <div className="timezone-box">
    <div className="timezone-head">
      <span className="timezone-title">
        🌍 TIMEZONE
      </span>

      <span className="timezone-badge">
        IMPORTANT
      </span>
    </div>

    <Controller
      name="timeZone"
      control={control}
      render={({ field }) => (
        <SearchableSelect
          value={field.value}
          onChange={field.onChange}
          options={timezones}
          placeholder="Select timezone"
        />
      )}
    />

    {errors.timeZone && (
      <span className="error-text">
        {errors.timeZone.message}
      </span>
    )}

    <p className="timezone-note">
      Your timezone helps us schedule reports and alerts correctly.
    </p>
  </div>
      </div>
      </div>
  )
}
