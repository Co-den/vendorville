"use client";

import "@/app/dashboard/dashboard.css";
import NavbarMobile from "@/components/NavbarMobile";
import api from "@/store/axiosInstance";
import { useReviewStore } from "@/store/reviewStore";
import { useStorefrontStore } from "@/store/storefrontStore";
import PaystackPop from "@paystack/inline-js";
import { Mail, MapPin, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import "./storefront.css";

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
  const router = useRouter();
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

  //reviews
  const {
    reviews,
    stats,
    isSubmitting: isSubmittingReview,
    error: reviewError,
    successMessage,
    fetchPublicReviews,
    submitReview,
    clearMessages,
  } = useReviewStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewOrderNumber, setReviewOrderNumber] = useState("");
  const [reviewPhone, setReviewPhone] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [activeImage, setActiveImage] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "pay_on_delivery"
  >("pay_on_delivery");
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [deliveryZoneId, setDeliveryZoneId] = useState<number | null>(null);

  useEffect(() => {
    if (slug) fetchStorefront(slug);
  }, [slug]);

  // for reviews
  useEffect(() => {
    if (slug) fetchPublicReviews(slug);
  }, [slug]);
  const [myPoints, setMyPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [giftCardCode, setGiftCardCode] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (token) {
      api
        .get(`/store/${slug}/my-points`)
        .then((res) => setMyPoints(res.data.points))
        .catch(() => {});
    }
  }, [slug]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const selectedZone = business?.deliveryZones.find(
    (z) => z.id === deliveryZoneId,
  );
  const deliveryFee = selectedZone?.fee || 0;
  const grandTotal = cartTotal + deliveryFee;

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview(slug, {
        orderNumber: reviewOrderNumber,
        phone: reviewPhone,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewOrderNumber("");
      setReviewPhone("");
      setReviewRating(5);
      setReviewComment("");
      setShowReviewForm(false);
    } catch {
      error;
    }
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

  const resetCheckout = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setDeliveryAddress("");
    setRedeemPoints(0);
    setGiftCardCode("");
    setCheckoutError("");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }
    if (deliveryZoneId === null) {
      setCheckoutError("Please select a delivery zone.");
      return;
    }
    const CheckoutPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      deliveryAddress: deliveryAddress.trim(),
      deliveryZoneId,
      deliveryFee: Number(deliveryFee || 0),
      paymentMethod,
      items: cart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      redeemPoints: redeemPoints > 0 ? redeemPoints : undefined,
      giftCardCode: giftCardCode.trim() || undefined,
    };

    let order;
    try {
      order = await createOrder(slug, CheckoutPayload);
    } catch (err: any) {
      setCheckoutError(
        err.response?.data?.message || err.message || "Could not place order.",
      );
      return;
    }

    const actualTotal = Number(order.totalAmount || 0);
    setCheckoutTotal(actualTotal);
    const discount = Number(order.discountAmount || 0);
    setCheckoutDiscount(discount);

    if (paymentMethod === "paystack") {
      console.log("=== PAYSTACK V2 DEBUG ===");
      console.log("Public key:", process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
      console.log("Order:", order);
      console.log("Actual total:", actualTotal);
      console.log("Paystack reference:", order.paystackReference);

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is missing");

        setCheckoutError(
          "Paystack public key is missing. Please check your environment configuration.",
        );

        return;
      }

      if (actualTotal <= 0) {
        console.log("Total is zero. Skipping Paystack.");

        setOrderSuccess(order);
        setCart([]);
        setShowCheckout(false);
        resetCheckout();

        return;
      }

      try {
        console.log("Creating Paystack V2 instance...");
        const paystack = new PaystackPop();
        console.log("Paystack V2 instance:", paystack);
        await paystack.newTransaction({
          key: publicKey,
          email:
            customerEmail.trim() ||
            `${customerPhone.trim()}@guest.vendorville.com`,
          amount: Math.round(actualTotal * 100),
          currency: "NGN",
          reference: order.paystackReference,
          onSuccess: async (transaction: any) => {
            console.log("PAYSTACK SUCCESS:", transaction);

            try {
              console.log("Verifying payment...");

              await verifyPayment(slug, transaction.reference);

              console.log("Payment verified successfully");

              setOrderSuccess(order);
              setCart([]);
              setShowCheckout(false);
              resetCheckout();
            } catch (err: any) {
              console.error("PAYMENT VERIFICATION ERROR:", err);
              console.error("RESPONSE:", err.response?.data);

              setCheckoutError(
                err.response?.data?.message ||
                  "Payment was received but verification failed. Please contact the vendor.",
              );
            }
          },

          onCancel: () => {
            console.log("PAYSTACK PAYMENT CANCELLED");

            setCheckoutError(
              "Payment was cancelled. Your order has been saved as pending.",
            );
          },

          onError: (error: any) => {
            console.error("PAYSTACK ERROR:", error);

            setCheckoutError(
              error?.message ||
                "Paystack could not process the payment. Please try again.",
            );
          },

          onLoad: (response: any) => {
            console.log("PAYSTACK CHECKOUT LOADED:", response);
          },
        });

        console.log("Paystack V2 transaction started");
      } catch (err: any) {
        console.error("PAYSTACK SETUP ERROR:", err);

        setCheckoutError(
          err?.message ||
            "Your order was saved, but we could not start the payment popup.",
        );
      }
    } else {
      setOrderSuccess(order);
      setCart([]);
      setShowCheckout(false);
      resetCheckout();
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
  const images =
    business.premisesImages.length > 0 ? business.premisesImages : [];

  return (
    <>
      <NavbarMobile />
      <div className="storefront-page">
        <div className="sf-banner">
          {images.length > 0 ? (
            <>
              <div className="sf-banner-images">
                <img src={images[activeImage]} alt={business.name} />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    className="sf-banner-nav prev"
                    onClick={() =>
                      setActiveImage(
                        (i) => (i - 1 + images.length) % images.length,
                      )
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    className="sf-banner-nav next"
                    onClick={() =>
                      setActiveImage((i) => (i + 1) % images.length)
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <div className="sf-banner-dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={`sf-banner-dot ${i === activeImage ? "active" : ""}`}
                        onClick={() => setActiveImage(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="sf-banner-fallback" />
          )}
          <div className="sf-banner-overlay" />

          <button
            className="sf-back-btn"
            onClick={() => router.push("/discover")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Discover
          </button>

          <span
            className={`sf-status-badge ${business.isOpenToday ? "open" : "closed"}`}
          >
            <span className="dot"></span>
            {business.isOpenToday ? "Available" : "Currently Unavailable"}
          </span>
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
              <h1 className="business-name">{business.name}</h1>
              <div className="sf-rating">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = Math.round(stats.avgRating);

                  return (
                    <Star
                      key={index}
                      size={16}
                      className={
                        index < rating ? "sf-star-filled" : "sf-star-empty"
                      }
                      fill={index < rating ? "currentColor" : "none"}
                    />
                  );
                })}

                <b>{stats.avgRating.toFixed(1)}</b>
                <span>({stats.total} reviews)</span>
              </div>
            </div>
          </div>

          <button
            className="storefront-cart-btn"
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
          >
            <ShoppingCart />
            Cart ({cart.reduce((s, i) => s + i.quantity, 0)}) · ₦
            {cartTotal.toLocaleString()}
          </button>
          <Link
            href={`/customer/login?redirect=${slug}`}
            className="storefront-cart-btn"
            style={{ marginRight: 8 }}
          >
            My Account
          </Link>
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
              style={{
                transform: `translateX(-${activeIndex * (100 / tabs.length)}%)`,
              }}
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
                      const inCart = cart.find(
                        (i) => i.productId === product.id,
                      );
                      return (
                        <div
                          className="storefront-product-card"
                          key={product.id}
                        >
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
                    Available: {business.availableDays.join(", ")}
                  </p>
                </div>
                <div className="panel" style={{ marginTop: 16 }}>
                  <h2>Get Directions</h2>
                  <p
                    style={{
                      color: "var(--gray)",
                      fontSize: "0.86rem",
                      margin: "8px 0 16px",
                    }}
                  >
                    Visit {business.name} in person using the address above.
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-create"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      textDecoration: "none",
                    }}
                  >
                    <MapPin />
                    Open in Google Maps
                  </a>

                  <div
                    style={{
                      marginTop: 16,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <iframe
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`}
                    />
                  </div>
                </div>
              </div>

              {/* ===== REVIEWS TAB ===== */}
              <div className="sf-slide">
                <div className="panel" style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-fraunces), serif",
                          fontWeight: 800,
                          fontSize: "1.8rem",
                        }}
                      >
                        {stats.avgRating.toFixed(1)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          color: "#fbbf24",
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, index) => {
                          const rating = Math.round(stats.avgRating);

                          return (
                            <Star
                              key={index}
                              size={16}
                              strokeWidth={2}
                              fill={index < rating ? "currentColor" : "none"}
                            />
                          );
                        })}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                        {stats.total} review{stats.total === 1 ? "" : "s"}
                      </div>
                    </div>
                    <button
                      className="btn-create"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Leave a Review
                    </button>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div
                    className="panel"
                    style={{ textAlign: "center", padding: "40px 24px" }}
                  >
                    <p style={{ color: "var(--gray)" }}>
                      No reviews yet. Be the first to order and leave feedback.
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      className="panel"
                      key={review.id}
                      style={{ marginBottom: 12 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>
                            {review.customerName}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              color: "#fbbf24",
                            }}
                          >
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                size={16}
                                strokeWidth={2}
                                fill={
                                  index < review.rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <span
                          style={{ fontSize: "0.76rem", color: "var(--gray)" }}
                        >
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-NG",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                      {review.comment && (
                        <p style={{ fontSize: "0.86rem", marginBottom: 8 }}>
                          {review.comment}
                        </p>
                      )}
                      {review.vendorReply && (
                        <div
                          style={{
                            background: "var(--offwhite)",
                            borderRadius: 8,
                            padding: "10px 14px",
                            fontSize: "0.82rem",
                            marginTop: 8,
                          }}
                        >
                          <strong style={{ color: "var(--accent)" }}>
                            Vendor reply:{" "}
                          </strong>
                          {review.vendorReply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ===== FIXED CONTACT SIDEBAR ===== */}
          <aside className="sf-sidebar">
            <div className="panel">
              <h2 style={{ marginBottom: 16 }}>Contact Details</h2>

              <div className="sf-contact-row">
                <div className="sf-contact-icon">
                  <MapPin />
                </div>
                <div>
                  <div className="sf-contact-label">Address</div>
                  <div className="sf-contact-value">{business.address}</div>
                </div>
              </div>

              {business.businessEmail && (
                <div className="sf-contact-row">
                  <div className="sf-contact-icon">
                    <Mail />
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
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
        {showReviewForm && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowReviewForm(false);
              clearMessages();
            }}
          >
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Leave a Review</h3>
              <p className="modal-sub">
                Enter your order details to verify your purchase.
              </p>

              <form onSubmit={handleSubmitReview}>
                <div className="modal-field">
                  <label>Order Number</label>
                  <input
                    type="text"
                    required
                    value={reviewOrderNumber}
                    onChange={(e) => setReviewOrderNumber(e.target.value)}
                    placeholder="e.g. VH-123456"
                  />
                </div>
                <div className="modal-field">
                  <label>Phone Number (used at checkout)</label>
                  <input
                    type="tel"
                    required
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>Rating</label>
                  <div style={{ display: "flex", gap: 6, fontSize: "1.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: star <= reviewRating ? "#f0a23a" : "#d1d5db",
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-field">
                  <label>Comment (optional)</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How was your experience?"
                  />
                </div>

                {reviewError && (
                  <div className="error-message" style={{ marginBottom: 14 }}>
                    {reviewError}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary-modal"
                    onClick={() => {
                      setShowReviewForm(false);
                      clearMessages();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-modal"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* ===== CHECKOUT MODAL ===== */}
        {showCheckout && (
          <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
            <div
              className="modal-card tall"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <div className="field-group">
                    <label className="field-label">Delivery Zone *</label>
                    <select
                      required
                      value={deliveryZoneId ?? ""}
                      onChange={(e) =>
                        setDeliveryZoneId(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    >
                      <option value="">Select your area</option>
                      {business?.deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — ₦{zone.fee.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  {myPoints > 0 && (
                    <div className="field-group">
                      <label className="field-label">
                        Redeem Points (You have {myPoints})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={myPoints}
                        value={redeemPoints}
                        onChange={(e) =>
                          setRedeemPoints(
                            Math.min(myPoints, Number(e.target.value)),
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  )}
                  <div className="field-group">
                    <label className="field-label">
                      Gift Card Code (optional)
                    </label>
                    <input
                      type="text"
                      value={giftCardCode}
                      onChange={(e) =>
                        setGiftCardCode(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. A1B2C3D4E5F6"
                    />
                  </div>
                  <div
                    className="wallet-balance-strip"
                    style={{ marginTop: 16 }}
                  >
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                        Subtotal: ₦{cartTotal.toLocaleString()} + Delivery: ₦
                        {Number(deliveryFee || 0).toLocaleString()}
                      </div>
                      {(redeemPoints > 0 || giftCardCode.trim()) && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--accent)",
                            marginTop: 4,
                          }}
                        >
                          Discounts/rewards will be verified at checkout.
                        </div>
                      )}
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
                      : `Place Order:  ₦${grandTotal.toLocaleString()}`}
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
        <footer>
          <div className="wrap">
            <div className="footer-grid">
              <div>
                <div className="brand">
                  <Link href="/" className="brand">
                    <Image
                      src="/images/vv.png"
                      alt="VendorVille"
                      width={180}
                      height={55}
                      priority
                      className="h-12 w-auto"
                    />
                  </Link>
                </div>
                <p className="tagline">
                  The all-in-one platform for Nigerian market vendors — track
                  orders, manage stock, and send Email, SMS &amp; WhatsApp
                  alerts, all from your phone.
                </p>
                <span className="footer-phone">+234 707 647 3776</span>
              </div>
              <div className="footer-col">
                <h4>Quick Links</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
                <a href="#">Blog</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#">About VendorVille</a>
                <a href="#">Become a Partner</a>
                <a href="#">Contact Us</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-col">
                <h4>VendorVille Technologies Limited</h4>
                <a href="#">
                  123 Market Avenue,
                  <br />
                  Enugu, Nigeria
                </a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 VendorVille Nigeria. All rights reserved.</span>
              <span>Nigeria Data Protection Act (NDPR) compliant</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
