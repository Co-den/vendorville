"use client";

import { useAuthStore } from "@/store/authStore";
import { plans, useSubscriptionStore } from "@/store/subscriptionStore";
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

const mockBusinesses: Business[] = [];

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
  const { plan, setPlan, isProcessing, setProcessing } = useSubscriptionStore();
  const limit = plans[plan].businessLimit;
  const [showRegister, setShowRegister] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState<{
    file: File;
    name: string;
    preview: string | null;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const atLimit = businesses.length >= limit;
  const [shortName, setShortName] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [telegram, setTelegram] = useState("");
  const [startedDate, setStartedDate] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [description, setDescription] = useState("");
  const [premisesImages, setPremisesImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const handlePremisesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const newImages = await Promise.all(
      files.map(async (file) => ({
        file,
        preview: await readFileAsDataUrl(file),
      })),
    );
    setPremisesImages((prev) => [...prev, ...newImages]);
  };

  const removePremisesImage = (index: number) => {
    setPremisesImages((prev) => prev.filter((_, i) => i !== index));
  };

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
    setShortName("");
    setCountryCode("+234");
    setWhatsapp("");
    setBusinessEmail("");
    setWebsite("");
    setFacebook("");
    setInstagram("");
    setTiktok("");
    setTelegram("");
    setStartedDate("");
    setVisibility("public");
    setDescription("");
    setPremisesImages([]);
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

  const handleUpgrade = (planId: string) => {
    if (!window.PaystackPop) return;

    setProcessing(planId as keyof typeof plans);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "vendor@example.com",
      amount: plans[planId as keyof typeof plans].price * 100,
      currency: "NGN",
      ref: `vh_sub_${Date.now()}`,
      callback: () => {
        setPlan(planId as keyof typeof plans);
        setProcessing(null);
        setShowUpgrade(false);
        setShowRegister(true);
      },
      onClose: () => {
        setProcessing(null);
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
      {businesses.length === 0 ? (
        <div
          className="panel"
          style={{ textAlign: "center", padding: "40px 24px" }}
        >
          <div
            className="stat-icon"
            style={{ margin: "0 auto 16px", width: 52, height: 52 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.1rem",
              marginBottom: 6,
            }}
          >
            Register your first business
          </h3>
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--gray)",
              marginBottom: 18,
            }}
          >
            Add your business details to start managing inventory, orders, and
            payments on your {plans[plan].name} plan.
          </p>
          <button
            className="biz-add-btn"
            style={{ margin: "0 auto" }}
            onClick={handleAddClick}
          >
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
            Register Business
          </button>
        </div>
      ) : (
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
      )}
      {/* ===== REGISTER BUSINESS MODAL ===== */}
      {showRegister && (
        <div className="modal-overlay" onClick={closeRegister}>
          <div className="modal-card tall" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </div>
                <h3>Register New Business</h3>
              </div>
              <div className="modal-header-actions">
                <button type="button" className="how-it-works-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  How it works
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={closeRegister}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="20"
                    height="20"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <div className="modal-body">
                <div className="timezone-banner">
                  <div className="timezone-banner-left">
                    <div className="timezone-banner-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" />
                      </svg>
                    </div>
                    <div>
                      <div className="timezone-banner-label">
                        Active Timezone
                      </div>
                      <div className="timezone-banner-value">Africa/Lagos</div>
                    </div>
                  </div>
                  <span className="timezone-banner-badge">From Account</span>
                </div>

                <div className="logo-upload-row">
                  <div className="logo-upload-box">
                    {logo?.preview ? (
                      <img src={logo.preview} alt="Logo" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--gray)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="22"
                        height="22"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          e.target.files?.[0] || null,
                          setLogo,
                          true,
                        )
                      }
                    />
                    <div className="logo-upload-plus">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </div>
                  <div className="logo-upload-text">
                    <strong>Business Logo</strong>
                    <span>Upload your brand identity (PNG, JPG).</span>
                  </div>
                </div>

                <div className="field-row-2">
                  <div className="field-group">
                    <label className="field-label">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                      </svg>
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Prucia Couture"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Short Name</label>
                    <input
                      type="text"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      placeholder="e.g. Prucia"
                    />
                  </div>
                </div>

                <div className="field-row-2">
                  <div className="field-group">
                    <label className="field-label">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      WhatsApp Business Number
                    </label>
                    <div className="phone-field-row">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="+234">NG +234</option>
                        <option value="+233">GH +233</option>
                        <option value="+254">KE +254</option>
                      </select>
                      <input
                        type="tel"
                        maxLength={10}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="10-10 digits, no leading 0"
                      />
                    </div>
                    <p className="field-hint">
                      Must be an active WhatsApp Business number. Enter without
                      leading 0.
                    </p>
                  </div>
                  <div className="field-group">
                    <label className="field-label">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="contact@business.com"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <hr className="section-divider" />

                <label className="field-label">
                  Social Media Links (optional)
                </label>
                <div className="field-row-2" style={{ marginBottom: 14 }}>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="facebook.com/yourbusiness"
                    />
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="instagram.com/yourbusiness"
                    />
                  </div>
                </div>
                <div className="field-row-2">
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="tiktok.com/@yourbusiness"
                    />
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="t.me/yourbusiness"
                    />
                  </div>
                </div>

                <hr className="section-divider" />

                <div className="field-group">
                  <label className="field-label">Started Date</label>
                  <input
                    type="date"
                    value={startedDate}
                    onChange={(e) => setStartedDate(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Public Visibility</label>
                  <div className="info-callout">
                    Setting your business to "Public" allows customers to easily
                    find you on our directory. A professional business profile
                    builds trust and attracts more customers.
                  </div>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">Public — Visible to everyone</option>
                    <option value="private">
                      Private — Only visible to you
                    </option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Headquarters Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full physical address..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your business..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">
                    Business Premises Images
                  </label>
                  <p
                    className="field-hint"
                    style={{ marginTop: 0, marginBottom: 10 }}
                  >
                    Please upload a clear front view photo of your business
                    premises showing the business name signboard. Upload at
                    least 3 to 5 photos.
                  </p>
                  <div className="premises-grid">
                    {premisesImages.map((img, i) => (
                      <div className="premises-thumb" key={i}>
                        <img src={img.preview} alt={`Premises ${i + 1}`} />
                        <button
                          type="button"
                          className="premises-thumb-remove"
                          onClick={() => removePremisesImage(i)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="10"
                            height="10"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <label className="premises-add-btn">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePremisesUpload}
                      />
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
                      Add
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeRegister}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Business"}
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
              {(Object.keys(plans) as (keyof typeof plans)[])
                .filter((id) => id !== plan)
                .map((id) => (
                  <div
                    className={`plan-option ${plans[id] && "popular" in plans[id] && plans[id].popular ? "recommended" : ""}`}
                    key={id}
                    onClick={() => handleUpgrade(id)}
                  >
                    <div>
                      <div className="plan-option-name">{plans[id].name}</div>
                      <div className="plan-option-desc">
                        {plans[id].features[0]}
                      </div>
                    </div>
                    <div className="plan-option-price">
                      {isProcessing === id ? (
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
