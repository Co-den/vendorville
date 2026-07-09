import { z } from 'zod'

export const step1Schema = z.object({
  email: z.string().email('Invalid email address'),
})

export type Step1Data = z.infer<typeof step1Schema>

export const step2Schema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export type Step2Data = z.infer<typeof step2Schema>

export const step3Schema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PIN must be 4 digits'),
})

export type Step3Data = z.infer<typeof step3Schema>

export const completeLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be 4 digits'),
  rememberMe: z.boolean().optional(),
})

export type CompleteLoginData = z.infer<typeof completeLoginSchema>
