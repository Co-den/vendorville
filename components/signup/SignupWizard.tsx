"use client";

import {
  CompleteFormData,
  completeSchema
} from "@/app/signup/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Step1Identity } from "./Step1Identity";
import { Step2Business } from "./Step2Business";
import { Step3Location } from "./Step3Location";
import { Step4Security } from "./Step4Security";
import { StepIndicator } from "./StepIndicator";

export function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("[v0] Form submitted:", data);
      // TODO: Send data to backend
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Success - redirect or show success state
    } catch (error) {
      console.error("[v0] Form submission error:", error);
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
        "timezone",
      ]);
    } else if (currentStep === 3) {
      isStepValid = await trigger(["state", "city", "address"]);
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
            >
              Back
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
      </form>
    </>
  );
}
