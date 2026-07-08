"use client";

import { CompleteFormData, completeSchema } from "@/app/signup/schema";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Step1Identity } from "./Step1Identity";
import { Step2Business } from "./Step2Business";
import { Step3Location } from "./Step3Location";
import { Step4Security } from "./Step4Security";
import { StepIndicator } from "./StepIndicator";

export function SignupWizard() {
  const { signup } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<CompleteFormData>({
    resolver: zodResolver(completeSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CompleteFormData) => {
    setIsSubmitting(true);

    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        businessType: data.businessType,
        country: data.country,
        timeZone: data.timeZone,
        state: data.state,
        city: data.city,
        businessAddress: data.businessAddress,
        postalCode: data.postalCode,
        pin: data.pin,
      });

      console.log("Signup successful");

      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    let isStepValid = false;

    if (currentStep === 1) {
      isStepValid = await trigger([
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ]);
    } else if (currentStep === 2) {
      isStepValid = await trigger([
        "phoneNumber",
        "businessName",
        "businessType",
        "country",
        "timeZone",
      ]);
    } else if (currentStep === 3) {
      isStepValid = await trigger(["state", "city", "businessAddress"]);
    } else if (currentStep === 4) {
      isStepValid = await trigger(["pin", "confirmPin", "agreeTerms"]);
    }

    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <Step1Identity register={register} errors={errors} watch={watch} />
          )}
          {currentStep === 2 && (
            <Step2Business register={register} errors={errors} />
          )}
          {currentStep === 3 && (
            <Step3Location register={register} errors={errors} />
          )}
          {currentStep === 4 && (
            <Step4Security
              control={control}
              register={register}
              watch={watch}
              errors={errors}
            />
          )}
        </motion.div>

        <div className="form-buttons">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              aria-label="Go back to previous step"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontSize: "0.84rem",
            color: "#667085",
          }}
        >
          Have an account?{" "}
          <Link href="/login" style={{ color: "#3a844f", fontWeight: "700" }}>
            Login
          </Link>
        </div>
      </form>
    </>
  );
}
