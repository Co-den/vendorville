"use client";

import { CompleteLoginData, completeLoginSchema } from "@/app/auth/login/schema";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Step1Email } from "./Step1Email";
import { Step2Password } from "./Step2Password";
import { Step3PIN } from "./Step3PIN";

const steps = [
  { id: 1, title: "Email", key: "email" },
  { id: 2, title: "Password", key: "password" },
  { id: 3, title: "PIN", key: "pin" },
];

export function LoginWizard() {
  const { login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<CompleteLoginData>({
    resolver: zodResolver(completeLoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      pin: "",
      rememberMe: false,
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  const onNext = async () => {
    const isStepValid = await trigger(
      ["email", "password", "pin"][currentStep - 1] as any,
    );
    if (isStepValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CompleteLoginData) => {
    setIsLoading(true);
    try {
      // Handle login submission
     await login({
        email: data.email,
        password: data.password,
        pin: data.pin,
        rememberMe: data.rememberMe,
      });
      // Redirect to dashboard after successful login
      router.push('/auth/verify-code');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-header">
            <span className="step-count">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="step-dots">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`step-dot ${
                  step.id < currentStep
                    ? "completed"
                    : step.id === currentStep
                      ? "active"
                      : "pending"
                }`}
              ></div>
            ))}
          </div>
          <div className="step-labels">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`step-label ${
                  step.id < currentStep
                    ? "completed"
                    : step.id === currentStep
                      ? "active"
                      : ""
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && <Step1Email />}
        {currentStep === 2 && <Step2Password />}
        {currentStep === 3 && <Step3PIN />}

        {/* Form Buttons */}
        <div className="form-buttons">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
              aria-label="Go back to previous step"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {currentStep < steps.length && (
            <button type="button" className="btn-primary" onClick={onNext}>
              Continue <ChevronRight size={16} />
            </button>
          )}
          {currentStep === steps.length && (
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Enter Dashboard"}
            </button>
          )}
        </div>

        {/* Footer Links */}
        {currentStep === 1 && (
          <>
            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
                fontSize: "0.84rem",
                color: "#667085",
              }}
            >
              New?{" "}
              <Link
                href="/auth/signup"
                style={{ color: "#3a844f", fontWeight: "700" }}
              >
                Create Account
              </Link>
            </div>
            <Link href="/" className="secondary-btn">
              Login as Customer
            </Link>
            <div
              style={{
                marginTop: "16px",
                textAlign: "center",
                fontSize: "0.72rem",
                color: "#c7ccd3",
              }}
            >
              © 2026 usevendorhub.com
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
}
