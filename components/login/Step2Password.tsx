"use client";

import { CompleteLoginData } from "@/app/auth/login/schema";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export function Step2Password() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext<CompleteLoginData>();

  return (
    <div className="step-content">
      <h2>Enter Password</h2>
      <div className="rule"></div>
      <p className="tagline">Keep your account secure with your password.</p>

      <div className="field password-field">
        <label>Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="error-text">{errors.password.message}</span>
        )}
      </div>

      <div className="checkbox-field">
        <input type="checkbox" id="rememberMe" {...register("rememberMe")} />
        <label htmlFor="rememberMe" className="checkbox-label">
          Remember me on this device
        </label>
      </div>

      <div style={{ textAlign: "right", marginTop: 8 }}>
        <Link
          href="/auth/forgot-password"
          style={{ fontSize: "0.8rem", color: "#667085" }}
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
