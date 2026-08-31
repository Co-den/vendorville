"use client";

import { useBusinessStore } from "@/store/businessStore";
import { useReviewStore } from "@/store/reviewStore";
import { Star, StarHalf } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const { businesses, fetchBusinesses } = useBusinessStore();
  const { reviews, stats, isLoading, fetchVendorReviews, replyToReview } =
    useReviewStore();

  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (businesses.length > 0 && activeBusinessId === null) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    if (activeBusinessId !== null) {
      fetchVendorReviews(activeBusinessId);
    }
  }, [activeBusinessId]);

  const openReply = (reviewId: number) => {
    setReplyingTo(reviewId);
    setReplyText("");
  };

  const submitReply = async (reviewId: number) => {
    if (activeBusinessId === null) return;
    await replyToReview(activeBusinessId, reviewId, replyText);
    setReplyingTo(null);
  };

  if (businesses.length === 0) {
    return (
      <>
        <div className="dash-welcome">
          <div className="dash-welcome-eyebrow">
            <span className="dash-welcome-icon">
              <StarHalf size={19} strokeWidth={2.5} />
            </span>
            <span>REVIEWS</span>
          </div>
          <h1>
            What customers are <span>saying</span>.
          </h1>
        </div>
        <div
          className="panel"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
            Register a business to start collecting reviews.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dash-welcome-icon">
            <StarHalf size={25} strokeWidth={2.5} />
          </span>
          <span>REVIEWS</span>
        </div>
        <h1>
          What customers are <span>saying</span>.
        </h1>
        <p>Reviews are submitted by customers after a verified order.</p>
      </div>

      {businesses.length > 1 && (
        <div
          className="field-group"
          style={{ maxWidth: 320, marginBottom: 20 }}
        >
          <label className="field-label">Business</label>
          <select
            value={activeBusinessId ?? ""}
            onChange={(e) => setActiveBusinessId(Number(e.target.value))}
          >
            {businesses.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="dash-grid" style={{ marginBottom: 20 }}>
        <div className="panel" style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 800,
              fontSize: "2.4rem",
              color: "var(--ink)",
            }}
          >
            {stats.avgRating.toFixed(1)}
          </div>
          <div
            style={{
              color: "#fbbf24",
              fontSize: "1.2rem",
              marginBottom: 6,
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={20}
                fill={
                  index < Math.round(stats.avgRating) ? "currentColor" : "none"
                }
                stroke="currentColor"
              />
            ))}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
            {stats.total} reviews
          </div>
        </div>

        <div className="panel">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div
              key={star}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  width: 40,
                  color: "var(--gray)",
                }}
              >
                <span style={{ fontSize: "0.8rem" }}>{star}</span>
                <Star size={14} fill="currentColor" stroke="currentColor" />
              </div>

              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "var(--offwhite)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${stats.total ? (stats.breakdown[i] / stats.total) * 100 : 0}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--gray)",
                  width: 20,
                }}
              >
                {stats.breakdown[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent Reviews</h2>
        </div>

        {isLoading ? (
          <p
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--gray)",
            }}
          >
            Loading...
          </p>
        ) : reviews.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--gray)",
              fontSize: "0.86rem",
            }}
          >
            No reviews yet.
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "16px 0",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--ink)",
                    }}
                  >
                    {review.customerName}
                  </div>
                  <div
                    style={{
                      color: "#fbbf24",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={index < review.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: "0.76rem", color: "var(--gray)" }}>
                  {new Date(review.createdAt).toLocaleDateString("en-NG", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {review.comment}
                </p>
              )}

              {review.vendorReply ? (
                <div
                  style={{
                    background: "var(--offwhite)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: "0.82rem",
                  }}
                >
                  <strong style={{ color: "var(--accent)" }}>
                    Your reply:{" "}
                  </strong>
                  {review.vendorReply}
                </div>
              ) : replyingTo === review.id ? (
                <div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: "100%",
                      minHeight: 70,
                      padding: 10,
                      borderRadius: 8,
                      border: "1.5px solid var(--line)",
                      fontFamily: "inherit",
                      fontSize: "0.84rem",
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-secondary-modal"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-primary-modal"
                      onClick={() => submitReply(review.id)}
                      disabled={!replyText.trim()}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="panel-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => openReply(review.id)}
                >
                  Reply to this review
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
