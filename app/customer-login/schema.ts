import { z } from 'zod'

const phoneRegex = /^\d{10}$/

export const step1Schema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z
    .string()
    .refine((val) => phoneRegex.test(val.replace(/\s/g, '')), {
      message: 'Phone number must be 10 digits',
    }),
})

export type Step1Data = z.infer<typeof step1Schema>

export const step2Schema = z.object({
  pin: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), {
      message: 'PIN must be 4 digits',
    }),
})

export type Step2Data = z.infer<typeof step2Schema>

export const completeCustomerLoginSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z
    .string()
    .refine((val) => phoneRegex.test(val.replace(/\s/g, '')), {
      message: 'Phone number must be 10 digits',
    }),
  pin: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), {
      message: 'PIN must be 4 digits',
    }),
})

export type CompleteCustomerLoginData = z.infer<typeof completeCustomerLoginSchema>
