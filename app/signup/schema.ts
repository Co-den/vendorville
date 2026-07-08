import { z } from "zod";

export const step1Schema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const step2Schema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  country: z.string().min(1, "Country is required"),
  timeZone: z.string().min(1, "Timezone is required"),
});

export const step3Schema = z.object({
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  postalCode: z.string().optional(),
});

export const step4Schema = z
  .object({
    pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
    confirmPin: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service",
    }),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;

// Combine schemas without merge due to refinements
export const completeSchema = z
  .object({
    // Step 1
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    // Step 2
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    businessName: z.string().min(2, "Business name is required"),
    businessType: z.string().min(1, "Business type is required"),
    country: z.string().min(1, "Country is required"),
    timeZone: z.string().min(1, "Timezone is required"),
    // Step 3
    state: z.string().min(2, "State is required"),
    city: z.string().min(2, "City is required"),
    businessAddress: z.string().min(5, "Address is required"),
    postalCode: z.string().optional(),
    // Step 4
    pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
    confirmPin: z.string(),
    agreeTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  })
  .refine((data) => data.agreeTerms === true, {
    message: "You must agree to the Terms of Service",
    path: ["agreeTerms"],
  });

export type CompleteFormData = z.infer<typeof completeSchema>;
