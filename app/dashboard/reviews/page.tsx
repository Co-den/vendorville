"use client";

import { useState } from 'react'

const mockReviews = [
  {
    id: 1,
    customer: "Chidinma O.",
    rating: 5,
    comment:
      "Fast delivery and the fabric quality was exactly as pictured. Will order again!",
    date: "2 days ago",
    reply: null,
  },
  {
    id: 2,
    customer: "Emeka O.",
    rating: 4,
    comment: "Good service overall, packaging could be better.",
    date: "5 days ago",
    reply: "Thank you for the feedback — we've improved our packaging since!",
  },
  {
    id: 3,
    customer: "Aisha B.",
    rating: 5,
    comment: "Best vendor on the platform. Always responsive on WhatsApp.",
    date: "1 week ago",
    reply: null,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length,
  );

  const openReply = (id: number) => {
    setReplyingTo(id);
    setReplyText("");
  };

  const submitReply = (id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r)),
    );
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <>
      <div className="dash-welcome">
        <div className="dash-welcome-eyebrow">
          <span className="dot"></span>Reviews
        </div>
        <h1>
          What customers are <span>saying</span>.
        </h1>
        <p>Customer feedback appears here once your storefront goes live.</p>
      </div>

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
            {avgRating.toFixed(1)}
          </div>
          <div
            style={{ color: "#f0a23a", fontSize: "1.2rem", marginBottom: 6 }}
          >
            {"★".repeat(Math.round(avgRating))}
            {"☆".repeat(5 - Math.round(avgRating))}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
            {reviews.length} reviews
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
              <span
                style={{ fontSize: "0.8rem", width: 40, color: "var(--gray)" }}
              >
                {star} star
              </span>
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
                    width: `${reviews.length ? (ratingCounts[i] / reviews.length) * 100 : 0}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
              <span
                style={{ fontSize: "0.78rem", color: "var(--gray)", width: 20 }}
              >
                {ratingCounts[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent Reviews</h2>
        </div>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}
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
                  {review.customer}
                </div>
                <div style={{ color: "#f0a23a", fontSize: "0.9rem" }}>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <span style={{ fontSize: "0.76rem", color: "var(--gray)" }}>
                {review.date}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.86rem",
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              {review.comment}
            </p>

            {review.reply ? (
              <div
                style={{
                  background: "var(--offwhite)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: "0.82rem",
                }}
              >
                <strong style={{ color: "var(--accent)" }}>Your reply: </strong>
                <span style={{ color: "var(--ink)" }}>{review.reply}</span>
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
        ))}
      </div>
    </>
  );
}
