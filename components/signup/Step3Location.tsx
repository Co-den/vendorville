"use client";

import { CompleteFormData } from "@/app/auth/signup/schema";
import { ChevronDown, Search, Check } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { useEffect, useRef, useState } from "react";

interface Step3LocationProps {
  register: UseFormRegister<CompleteFormData>;
  control: Control<CompleteFormData>;
  errors: FieldErrors<CompleteFormData>;
}

const nigerianStates = [
  "Lagos",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

export function Step3Location({
  register,
  control,
  errors,
}: Step3LocationProps) {
  const [stateOpen, setStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  const stateRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateRef.current &&
        !stateRef.current.contains(event.target as Node)
      ) {
        setStateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredStates = nigerianStates.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="step-content">
      <h2>Business Location</h2>

      <div className="rule"></div>

      <p className="tagline">Where is your business located?</p>

      {/* STATE */}
      <div className="field">
        <label htmlFor="state">State *</label>

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <div className="custom-select" ref={stateRef}>
              {/* Selected value */}
              <button
                type="button"
                className={`custom-select-trigger ${
                  errors.state ? "select-error" : ""
                }`}
                onClick={() => {
                  setStateOpen((prev) => !prev);
                  setStateSearch("");
                }}
                aria-expanded={stateOpen}
              >
                <span className={field.value ? "" : "placeholder"}>
                  {field.value || "Select state"}
                </span>

                <ChevronDown
                  size={18}
                  className={`select-chevron ${
                    stateOpen ? "rotate" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {stateOpen && (
                <div className="custom-select-dropdown">
                  {/* Search */}
                  <div className="select-search">
                    <Search size={17} />

                    <input
                      type="text"
                      placeholder="Search states..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Options */}
                  <div className="select-options">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((state) => (
                        <button
                          type="button"
                          key={state}
                          className={`select-option ${
                            field.value === state ? "selected" : ""
                          }`}
                          onClick={() => {
                            field.onChange(state);
                            setStateOpen(false);
                            setStateSearch("");
                          }}
                        >
                          <span>{state}</span>

                          {field.value === state && (
                            <Check size={16} />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="no-options">
                        No state found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        />

        {errors.state && (
          <span className="error-text">
            {errors.state.message}
          </span>
        )}
      </div>

      {/* CITY */}
      <div className="field">
        <label htmlFor="city">City *</label>

        <input
          id="city"
          type="text"
          placeholder="e.g., Ikeja, Lekki, Surulere"
          {...register("city")}
          aria-invalid={errors.city ? "true" : "false"}
        />

        {errors.city && (
          <span className="error-text">
            {errors.city.message}
          </span>
        )}
      </div>

      {/* BUSINESS ADDRESS */}
      <div className="field">
        <label htmlFor="businessAddress">
          Business Address *
        </label>

        <input
          id="businessAddress"
          type="text"
          placeholder="Street address, building, shop number"
          {...register("businessAddress")}
          aria-invalid={errors.businessAddress ? "true" : "false"}
        />

        {errors.businessAddress && (
          <span className="error-text">
            {errors.businessAddress.message}
          </span>
        )}
      </div>

      {/* POSTAL CODE */}
      <div className="field">
        <label htmlFor="postalCode">Postal Code</label>

        <input
          id="postalCode"
          type="text"
          placeholder="Optional"
          {...register("postalCode")}
          aria-invalid={errors.postalCode ? "true" : "false"}
        />

        {errors.postalCode && (
          <span className="error-text">
            {errors.postalCode.message}
          </span>
        )}
      </div>
    </div>
  );
}