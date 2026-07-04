"use client";

import type { CompleteCustomerLoginData } from "@/app/customer-login/schema";
import { useEffect, useRef, useState } from "react";
import { FormState, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface Step2PINProps {
  register: UseFormRegister<CompleteCustomerLoginData>;
  formState: FormState<CompleteCustomerLoginData>;
  setValue: UseFormSetValue<CompleteCustomerLoginData>;
  onSubmit: () => void;
  onBack: () => void;
  phoneNumber: string;
  isLoading?: boolean;
}

export function Step2PIN({
  register,
  formState: { errors },
  setValue,
  onSubmit,
  onBack,
  phoneNumber,
  isLoading,
}: Step2PINProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pinRegister = register("pin");

  useEffect(() => {
    setValue("pin", digits.join(""), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [digits, setValue]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);

    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const updated = [...digits];
        updated[index] = "";
        setDigits(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="step-content">
      <h2>Verify Your Identity</h2>

      <div className="rule" />

      <p className="tagline">Enter the 4-digit PIN sent to {phoneNumber}</p>

      {/* Hidden RHF field */}
      <input type="hidden" {...pinRegister} />

      <div className="pin-group">
        <label className="pin-label">Enter PIN</label>

        <div className="pin-row">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
      </div>

      {errors.pin && (
        <span className="error-text">{String(errors.pin.message)}</span>
      )}

      <div className="form-buttons">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
          disabled={isLoading}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "View Orders"}

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <div className="resend-section">
        <p>
          Didn&apos;t receive a PIN?{" "}
          <button type="button" className="resend-link">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
