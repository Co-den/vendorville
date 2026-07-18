"use client";

import "@/app/dashboard/dashboard.css";
import { useStorefrontStore } from "@/store/storefrontStore";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import "./storefront.css";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
type Tab = "overview" | "locations" | "reviews";

export default function StorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;
  const {
    business,
    products,
    isLoading,
    isSubmitting,
    error,
    fetchStorefront,
    createOrder,
    verifyPayment,
  } = useStorefrontStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("1500");
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "pay_on_delivery"
  >("pay_on_delivery");
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    if (slug) fetchStorefront(slug);
  }, [slug]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const grandTotal = cartTotal + Number(deliveryFee || 0);

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock === 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        })
        .filter((i): i is CartItem => i !== null),
    );
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");

    const payload = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      deliveryAddress,
      deliveryFee: Number(deliveryFee),
      paymentMethod,
      items: cart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const order = await createOrder(slug, payload);

      if (paymentMethod === "paystack") {
        if (!window.PaystackPop) {
          setCheckoutError("Payment system still loading, please try again.");
          return;
        }
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: customerEmail || `${customerPhone}@guest.vendorville.com`,
          amount: Math.round(grandTotal * 100),
          currency: "NGN",
          ref: order.paystackReference,
          callback: async (response: any) => {
            await verifyPayment(slug, response.reference);
            setOrderSuccess(order);
            setCart([]);
            setShowCheckout(false);
          },
          onClose: () => {},
        });
        handler.openIframe();
      } else {
        setOrderSuccess(order);
        setCart([]);
        setShowCheckout(false);
      }
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || "Could not place order.");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.5rem",
          }}
        >
          Store not found
        </h1>
        <p style={{ color: "var(--gray)", marginTop: 8 }}>
          {error || "This store may no longer be available."}
        </p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "locations", label: "Locations" },
    { key: "reviews", label: "Reviews" },
  ];
  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  return (
    <div className="storefront-page">
      <div className="sf-banner">
        <div className="sf-banner-images">
          {business.premisesImages.length > 0 ? (
            <img src={business.premisesImages[0]} alt={business.name} />
          ) : (
            <div className="sf-banner-fallback" />
          )}
        </div>
        <div className="sf-banner-overlay" />
        <div className="sf-banner-content">
          <span
            className={`sf-status-badge ${business.isOpenToday ? "open" : "closed"}`}
          >
            <span className="dot"></span>
            {business.isOpenToday ? "Available" : "Currently Unavailable"}
          </span>
        </div>
      </div>

      <div className="sf-header-row">
        <div className="sf-header-left">
          <div className="sf-logo">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} />
            ) : (
              business.name[0]
            )}
          </div>
          <div>
            <h1>{business.name}</h1>
            <div className="sf-rating">
              ☆☆☆☆☆ <b>0.0</b> (0 reviews)
            </div>
          </div>
        </div>
        <button
          className="storefront-cart-btn"
          onClick={() => setShowCheckout(true)}
          disabled={cart.length === 0}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Cart ({cart.reduce((s, i) => s + i.quantity, 0)}) · ₦
          {cartTotal.toLocaleString()}
        </button>
      </div>

      <div className="sf-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`sf-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="sf-body">
        <div className="sf-main">
          <div
            className="sf-slider"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {/* ===== OVERVIEW TAB ===== */}
            <div className="sf-slide">
              <div className="panel">
                <h2>About this Business</h2>
                <p
                  style={{
                    color: "var(--gray)",
                    fontSize: "0.9rem",
                    marginBottom: 20,
                  }}
                >
                  {business.description || "No description provided yet."}
                </p>
                <hr className="section-divider" />
                <h3
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--gray)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Products
                </h3>
              </div>

              {products.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--gray)",
                    padding: "32px 0",
                  }}
                >
                  No products available right now.
                </p>
              ) : (
                <div
                  className="storefront-product-grid"
                  style={{ marginTop: 16 }}
                >
                  {products.map((product) => {
                    const inCart = cart.find((i) => i.productId === product.id);
                    return (
                      <div className="storefront-product-card" key={product.id}>
                        <div className="storefront-product-image">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                          ) : (
                            <span>{product.name[0]}</span>
                          )}
                        </div>
                        <div className="storefront-product-info">
                          <div className="storefront-product-name">
                            {product.name}
                          </div>
                          <div className="storefront-product-price">
                            ₦{product.price.toLocaleString()}
                          </div>
                          {inCart ? (
                            <div
                              className="pos-qty-control"
                              style={{ justifyContent: "center" }}
                            >
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, -1)}
                              >
                                −
                              </button>
                              <span>{inCart.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, 1)}
                                disabled={inCart.quantity >= product.stock}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="storefront-add-btn"
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===== LOCATIONS TAB ===== */}
            <div className="sf-slide">
              <div className="panel">
                <h2>Location</h2>
                <p
                  style={{
                    color: "var(--ink)",
                    fontWeight: 600,
                    marginTop: 10,
                  }}
                >
                  {business.address}
                </p>
                <p
                  style={{
                    color: "var(--gray)",
                    fontSize: "0.86rem",
                    marginTop: 14,
                  }}
                >
                  Available: {business.availableDays?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>

            {/* ===== REVIEWS TAB ===== */}
            <div className="sf-slide">
              <div
                className="panel"
                style={{ textAlign: "center", padding: "48px 24px" }}
              >
                <p style={{ color: "var(--gray)" }}>
                  No reviews yet. Be the first to order and leave feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FIXED CONTACT SIDEBAR ===== */}
        <aside className="sf-sidebar">
          <div className="panel">
            <h2 style={{ marginBottom: 16 }}>Contact Details</h2>

            <div className="sf-contact-row">
              <div className="sf-contact-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="sf-contact-label">Address</div>
                <div className="sf-contact-value">{business.address}</div>
              </div>
            </div>

            {business.businessEmail && (
              <div className="sf-contact-row">
                <div className="sf-contact-icon">
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
                </div>
                <div>
                  <div className="sf-contact-label">Email</div>
                  <div className="sf-contact-value">
                    {business.businessEmail}
                  </div>
                </div>
              </div>
            )}

            {(business.instagram || business.tiktok) && (
              <div className="sf-social-row">
                <div className="sf-contact-label" style={{ marginBottom: 8 }}>
                  Find Us On
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {business.instagram && (
                    <a
                      href={`https://${business.instagram}`}
                      target="_blank"
                      className="sf-social-pill instagram"
                    >
                      Instagram
                    </a>
                  )}
                  {business.tiktok && (
                    <a
                      href={`https://${business.tiktok}`}
                      target="_blank"
                      className="sf-social-pill tiktok"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              </div>
            )}

            {business.whatsappNumber && (
              <a
                href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                className="btn-create"
                style={{
                  width: "100%",
                  textAlign: "center",
                  display: "block",
                  marginTop: 20,
                  textDecoration: "none",
                }}
              >
                Call for Inquiries
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* ===== CHECKOUT + SUCCESS MODALS unchanged from before ===== */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal-card tall" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCheckout(false)}
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
            <form
              onSubmit={handleCheckout}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <div className="modal-body">
                <div className="pos-cart-items" style={{ marginBottom: 20 }}>
                  {cart.map((item) => (
                    <div className="pos-cart-item" key={item.productId}>
                      <div className="pos-cart-item-info">
                        <div className="pos-cart-item-name">{item.name}</div>
                        <div className="pos-cart-item-price">
                          {item.quantity} × ₦{item.price.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="field-group">
                  <label className="field-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="field-row-2">
                  <div className="field-group">
                    <label className="field-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Email (optional)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <hr className="section-divider" />
                <div className="field-group">
                  <label className="field-label">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="pay_on_delivery">Pay on Delivery</option>
                    <option value="paystack">Pay Now (Card/Transfer)</option>
                  </select>
                </div>
                <div className="wallet-balance-strip" style={{ marginTop: 16 }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                      Subtotal: ₦{cartTotal.toLocaleString()} + Delivery: ₦
                      {Number(deliveryFee).toLocaleString()}
                    </div>
                    <div className="wallet-balance-strip-value">
                      ₦{grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
                {checkoutError && (
                  <div className="error-message" style={{ marginTop: 14 }}>
                    {checkoutError}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : `Place Order — ₦${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="modal-overlay" onClick={() => setOrderSuccess(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Order Placed!</h3>
              <p className="modal-sub">
                {orderSuccess.orderNumber} — {business.name} will reach out to
                confirm delivery.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-primary-modal"
                  style={{ flex: "none", width: "100%" }}
                  onClick={() => setOrderSuccess(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <script src="https://js.paystack.co/v1/inline.js" async></script>
    </div>
  );
}
