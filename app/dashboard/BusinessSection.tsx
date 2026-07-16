"use client";

import { useAuthStore } from "@/store/authStore";
import { useBusinessStore } from "@/store/businessStore";
import { plans, useSubscriptionStore } from "@/store/subscriptionStore";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function BusinessSection() {
  const { user } = useAuthStore();
  const {
    businesses,
    isSubmitting,
    error: businessError,
    createBusiness,
    fetchBusinesses,
  } = useBusinessStore();
  const {
    plan,
    limit,
    isProcessing,
    error: subError,
    setProcessing,
    confirmUpgrade,
    fetchSubscription,
  } = useSubscriptionStore();

  const [showRegister, setShowRegister] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [formError, setFormError] = useState("");

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<{ file: File; preview: string } | null>(
    null,
  );
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

  useEffect(() => {
    fetchBusinesses();
    fetchSubscription();
  }, []);

  const atLimit = businesses.length >= limit;

  const handlePremisesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - premisesImages.length;

    if (remainingSlots <= 0) {
      setFormError("You can upload up to 5 premises photos.");
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newImages = await Promise.all(
      filesToAdd.map(async (file) => ({
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

  const handleLogoChange = async (file: File | null) => {
    if (!file) {
      setLogo(null);
      return;
    }
    setLogo({ file, preview: await readFileAsDataUrl(file) });
  };

  const resetForm = () => {
    setName("");
    setAddress("");
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
    setFormError("");
  };

  const closeRegister = () => {
    setShowRegister(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("shortName", shortName);
    formData.append(
      "whatsappNumber",
      whatsapp ? `${countryCode}${whatsapp}` : "",
    );
    formData.append("businessEmail", businessEmail);
    formData.append("website", website);
    formData.append("facebook", facebook);
    formData.append("instagram", instagram);
    formData.append("tiktok", tiktok);
    formData.append("telegram", telegram);
    formData.append("startedDate", startedDate);
    formData.append("visibility", visibility);
    formData.append("address", address);
    formData.append("description", description);

    if (logo) formData.append("logo", logo.file);
    premisesImages.forEach((img) =>
      formData.append("premisesImages", img.file),
    );

    try {
      await createBusiness(formData);
      closeRegister();
    } catch (err: any) {
      if (err.code === "BUSINESS_LIMIT_REACHED") {
        setShowRegister(false);
        setShowUpgrade(true);
      } else if (err.code === "SUBSCRIPTION_INACTIVE") {
        setFormError(
          "Your subscription has expired. Please renew your plan to add a business.",
        );
      } else {
        setFormError(err.message || "Something went wrong. Please try again.");
      }
    }
  };

  const handleUpgrade = (planId: keyof typeof plans) => {
    if (!window.PaystackPop) return;

    setProcessing(planId);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || "vendor@example.com",
      amount: plans[planId].price * 100,
      currency: "NGN",
      ref: `vh_sub_${Date.now()}`,
      callback: async (response: any) => {
        try {
          await confirmUpgrade(planId, response.reference);
          setShowUpgrade(false);
          setShowRegister(true);
        } catch (error) {
          console.error("Error confirming upgrade:", error);
        }
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
            your {plans[plan as keyof typeof plans]?.name || plan} plan
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
            payments on your {plans[plan as keyof typeof plans]?.name || plan}{" "}
            plan.
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
          {businesses.map((biz: any) => (
            <div className="biz-card" key={biz.id}>
              <div className="biz-card-top">
                <div className="biz-logo">
                  {biz.logoUrl ? (
                    <img src={biz.logoUrl} alt={biz.name} />
                  ) : (
                    biz.name[0]
                  )}
                </div>
                <div className="biz-card-info">
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
                    {biz.isVerified ? "Verified" : "Pending Review"}
                  </div>
                </div>
              </div>

              <a
                href={`/store/${biz.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="biz-store-link"
                title="View your storefront"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Store
              </a>
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
                {formError && (
                  <div className="error-message" style={{ marginBottom: 16 }}>
                    {formError}
                  </div>
                )}

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
                        handleLogoChange(e.target.files?.[0] || null)
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
                    <label className="field-label">Business Name *</label>
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
                  </div>
                  <div className="field-group">
                    <label className="field-label">Business Email</label>
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
              Your {plans[plan as keyof typeof plans]?.name || plan} plan
              supports {limit === Infinity ? "unlimited" : limit} business
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
                You've reached your business limit for the{" "}
                {plans[plan as keyof typeof plans]?.name || plan} plan.
              </p>
            </div>

            {subError && (
              <div className="error-message" style={{ marginBottom: 14 }}>
                {subError}
              </div>
            )}

            <div className="plan-options">
              {(Object.keys(plans) as (keyof typeof plans)[])
                .filter((id) => id !== plan)
                .map((id) => (
                  <div
                    className={`plan-option ${"popular" in plans[id] && plans[id].popular ? "recommended" : ""}`}
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
