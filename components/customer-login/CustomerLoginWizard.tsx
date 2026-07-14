"use client";

import type { CompleteCustomerLoginData } from "@/app/auth/customer-login/schema";
import { completeCustomerLoginSchema } from "@/app/auth/customer-login/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Step1Phone } from "./Step1Phone";
import { Step2PIN } from "./Step2PIN";

export function CustomerLoginWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { register, handleSubmit, formState, watch, getValues, setValue } =
    useForm<CompleteCustomerLoginData>({
      resolver: zodResolver(completeCustomerLoginSchema),
      mode: "onChange",
      defaultValues: {
        countryCode: "+234",
        phone: "",
        pin: "",
      },
    });

  const handleStep1Submit = async () => {
    const isValid = await handleSubmit(async () => {
      // Validate step 1 only
      const values = getValues();
      if (values.phone && values.countryCode) {
        setPhoneNumber(`${values.countryCode} ${values.phone}`);
        setStep(2);
      }
    })();
  };

  const handleStep2Submit = async () => {
    setIsLoading(true);
    try {
      await handleSubmit(async (data) => {
        // Here you would normally send the login request to your backend
        console.log("Login data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Redirect to orders page or show success
        window.location.href = "/customer-orders";
      })();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPhoneNumber("");
  };

  return (
    <form className="customer-form">
      {step === 1 && (
        <Step1Phone
          register={register}
          formState={formState}
          onSubmit={handleStep1Submit}
          isLoading={isLoading}
        />
      )}
      {step === 2 && (
        <Step2PIN
          register={register}
          formState={formState}
          setValue={setValue}
          onSubmit={handleStep2Submit}
          onBack={handleBack}
          phoneNumber={phoneNumber}
          isLoading={isLoading}
        />
      )}
    </form>
  );
}
