"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type Business = {
  id: string;
  name: string;
  logoPreview: string | null;
  address: string;
  phone: string;
};

type PlanId = "free" | "growth" | "pro";

const plans: Record<
  PlanId,
  { name: string; limit: number; price: number; desc: string }
> = {
  free: { name: "Free", limit: 1, price: 0, desc: "Manage 1 business" },
  growth: {
    name: "Growth",
    limit: 3,
    price: 15000,
    desc: "Manage up to 3 businesses",
  },
  pro: {
    name: "Pro",
    limit: Infinity,
    price: 35000,
    desc: "Unlimited businesses",
  },
};

const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Prucia Couture",
    logoPreview: null,
    address: "Enugu, Nigeria",
    phone: "+234 803 000 0000",
  },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function UploadField({
  label,
  hint,
  accept,
  file,
  onChange,
  isImage,
}: {
  label: string;
  hint: string;
  accept: string;
  file: { name: string; preview: string | null } | null;
  onChange: (file: File | null) => void;
  isImage: boolean;
}) {
  return (
    <div className="modal-field">
      <label>{label}</label>
      {file ? (
        <div className="upload-preview">
          {isImage && file.preview ? (
            <img src={file.preview} alt={file.name} />
          ) : (
            <div className="file-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          )}
          <span className="upload-preview-name">{file.name}</span>
          <button
            type="button"
            className="upload-preview-remove"
            onClick={() => onChange(null)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="upload-field">
          <input
            type="file"
            accept={accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
          <svg
            className="upload-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div className="upload-text">Click to upload</div>
          <div className="upload-hint">{hint}</div>
        </div>
      )}
    </div>
  );
}

export default function BusinessSection() {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [plan, setPlan] = useState<PlanId>("free");
  const [showRegister, setShowRegister] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<PlanId | null>(null);

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState<{
    file: File;
    name: string;
    preview: string | null;
  } | null>(null);
  const [cac, setCac] = useState<{
    file: File;
    name: string;
    preview: string | null;
  } | null>(null);
  const [shopPhoto, setShopPhoto] = useState<{
    file: File;
    name: string;
    preview: string | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = plans[plan].limit;
  const atLimit = businesses.length >= limit;

  const handleAddClick = () => {
    if (atLimit) {
      setShowUpgrade(true);
    } else {
      setShowRegister(true);
    }
  };

  const handleFileChange = async (
    file: File | null,
    setter: (
      val: { file: File; name: string; preview: string | null } | null,
    ) => void,
    isImage: boolean,
  ) => {
    if (!file) {
      setter(null);
      return;
    }
    const preview = isImage ? await readFileAsDataUrl(file) : null;
    setter({ file, name: file.name, preview });
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setPhone("");
    setLogo(null);
    setCac(null);
    setShopPhoto(null);
  };

  const closeRegister = () => {
    setShowRegister(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock — in production this would be a multipart/form-data POST to your backend,
    // uploading logo/CAC/shop photo to storage (e.g. Cloudinary) and creating a business record.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newBusiness: Business = {
      id: String(Date.now()),
      name,
      logoPreview: logo?.preview || null,
      address,
      phone,
    };

    setBusinesses((prev) => [...prev, newBusiness]);
    setIsSubmitting(false);
    closeRegister();
  };

  const handleUpgrade = (planId: PlanId) => {
    if (!window.PaystackPop) return;

    setIsUpgrading(planId);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "vendor@example.com",
      amount: plans[planId].price * 100,
      currency: "NGN",
      ref: `vh_sub_${Date.now()}`,
      callback: () => {
        // In production: verify the transaction server-side, then update the
        // vendor's subscription record before unlocking the new business limit.
        setPlan(planId);
        setIsUpgrading(null);
        setShowUpgrade(false);
        setShowRegister(true);
      },
      onClose: () => {
        setIsUpgrading(null);
      },
    });

    handler.openIframe();
  };

  return (
    <div className="biz-section">
      <div className="biz-header">
        <div>
          <h2>Your Businesses</h2>
          <p>
            {businesses.length} of {limit === Infinity ? "unlimited" : limit} on
            your {plans[plan].name} plan
          </p>
        </div>
        <button className="biz-add-btn" onClick={handleAddClick}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Business
        </button>
      </div>

      <div className="biz-grid">
        {businesses.map((biz) => (
          <div className="biz-card" key={biz.id}>
            <div className="biz-logo">
              {biz.logoPreview ? (
                <img src={biz.logoPreview} alt={biz.name} />
              ) : (
                biz.name[0]
              )}
            </div>
            <div>
              <div className="biz-name">{biz.name}</div>
              <div className="biz-meta">{biz.address}</div>
              <div className="biz-badge">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="10"
                  height="10"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== REGISTER BUSINESS MODAL ===== */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <h3>Register a New Business</h3>
            <p className="modal-sub">
              Add your business details for verification on VendorHub.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Business Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prucia Couture"
                />
              </div>

              <UploadField
                label="Business Logo"
                hint="PNG or JPG, up to 5MB"
                accept="image/*"
                file={logo}
                isImage
                onChange={(file) => handleFileChange(file, setLogo, true)}
              />

              <UploadField
                label="CAC Certificate"
                hint="PDF, PNG, or JPG, up to 10MB"
                accept=".pdf,image/*"
                file={cac}
                isImage={false}
                onChange={(file) =>
                  handleFileChange(
                    file,
                    setCac,
                    cac?.file.type.startsWith("image/") ?? false,
                  )
                }
              />

              <UploadField
                label="Photo of Business Shop"
                hint="PNG or JPG, up to 5MB"
                accept="image/*"
                file={shopPhoto}
                isImage
                onChange={(file) => handleFileChange(file, setShopPhoto, true)}
              />

              <div className="modal-field">
                <label>Business Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, state"
                />
              </div>

              <div className="modal-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary-modal"
                  onClick={closeRegister}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-modal"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register Business"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== UPGRADE / PAYWALL MODAL ===== */}
      {showUpgrade && (
        <div className="modal-overlay" onClick={() => setShowUpgrade(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Upgrade to Add More Businesses</h3>
            <p className="modal-sub">
              Your {plans[plan].name} plan supports{" "}
              {limit === Infinity ? "unlimited" : limit} business
              {limit === 1 ? "" : "es"}. Choose a plan below to register
              another.
            </p>

            <div className="plan-limit-banner">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p>
                You've reached your business limit for the {plans[plan].name}{" "}
                plan.
              </p>
            </div>

            <div className="plan-options">
              {(Object.keys(plans) as PlanId[])
                .filter((id) => id !== "free" && id !== plan)
                .map((id) => (
                  <div
                    className={`plan-option ${id === "growth" ? "recommended" : ""}`}
                    key={id}
                    onClick={() => handleUpgrade(id)}
                  >
                    <div>
                      <div className="plan-option-name">{plans[id].name}</div>
                      <div className="plan-option-desc">{plans[id].desc}</div>
                    </div>
                    <div className="plan-option-price">
                      {isUpgrading === id ? (
                        "Processing..."
                      ) : (
                        <>
                          ₦{plans[id].price.toLocaleString()}
                          <br />
                          <span>/month</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary-modal"
                style={{ width: "100%" }}
                onClick={() => setShowUpgrade(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
