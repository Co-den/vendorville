"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, CirclePlay, Play } from "lucide-react";
import { createPortal } from "react-dom";
import "./LiveDemo.css";

interface LiveDemoModalProps {
  videoId: string;
  duration?: string;
}

export default function LiveDemoModal({
  videoId,
  duration = "3:01 minutes",
}: LiveDemoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const modalContent = (
    <div
      className="live-demo-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-demo-title"
        className="live-demo-modal"
      >
        {/* Header */}
        <div className="live-demo-header">
          <div className="live-demo-header-content">
            <h2 id="live-demo-title" className="live-demo-title">
              See VendorVille in Action
            </h2>
            <p className="live-demo-subtitle">
              Complete walkthrough • {duration}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close demo"
            className="live-demo-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Container */}
        <div className="live-demo-video-container">
          {isLoading && (
            <div className="live-demo-loading">
              <div className="live-demo-spinner" />
              <p className="live-demo-loading-text">Loading video...</p>
            </div>
          )}

          <iframe
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
              videoId
            )}?autoplay=1&rel=0&modestbranding=1`}
            title="VendorVille complete walkthrough"
            className="live-demo-iframe"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer CTA */}
        <div className="live-demo-footer">
          <div className="live-demo-footer-content">
            <div className="live-demo-footer-text">
              <p className="live-demo-footer-title">
                Ready to transform how you manage your business?
              </p>
              <p className="live-demo-footer-subtitle">
                Join hundreds of vendors already using VendorVille
              </p>
            </div>

            <div className="live-demo-footer-actions">
              <button
                onClick={() => setIsOpen(false)}
                className="live-demo-btn-secondary"
              >
                Maybe Later
              </button>
              <Link href="/auth/signup" className="live-demo-btn-primary">
                <Play size={16} />
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <Link className="btn-white" href="/" onClick={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }}>
        <CirclePlay />
        Watch Live Demo
      </Link>

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}