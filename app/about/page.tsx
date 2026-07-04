"use client";

import { Heart, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import "./about.css";

export default function AboutPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -80px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
      observer.observe(el);
    });

    // Nav scroll shadow
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (window.scrollY > 0) {
        nav?.classList.add("scrolled");
      } else {
        nav?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <nav>
        <div className="wrap">
          <Link href="/" className="brand">
            <span className="mark"></span>VendorHub
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/">Features</Link>
            <Link href="/">Testimonials</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">Blog</Link>
            <Link href="/">FAQ</Link>
          </div>
          <div className="nav-right">
            <Link className="nav-login" href="/login">
              Login
            </Link>
            <Link className="nav-cta" href="/signup">
              Create Free Account
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay"></div>
        <div className="wrap">
          <div className="hero-content">
            <div className="hero-mission"> Our Mission</div>
            <h1>
              Empowering <span className="hl">Nigeria&apos;s Vendors</span>
            </h1>
            <p>
              From manual order tracking to fully automated operations,
              VendorHub is the infrastructure for the modern vendor business.
              Simple, affordable, and built to scale.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION SECTION */}
      <section className="problem-section">
        <div className="wrap">
          <div className="problem-container">
            <div className="reveal">
              <div className="problem-eyebrow">⚠ The Reality</div>
              <h2>
                Built From <span className="hl">Real World Pain</span>
              </h2>
              <p>
                Across Nigeria, we witnessed how hardworking vendors lost
                business to operational chaos. We built VendorHub to end the
                cycle of manual errors and lost sales.
              </p>
              <div className="problem-list reveal-stagger">
                <div className="problem-item">
                  <span className="problem-num">01</span>
                  <div className="problem-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                      <path d="M3 8v8l9 5 9-5V8" />
                      <path d="M12 13v8" />
                    </svg>
                  </div>
                  <div>
                    <h3>Lost Inventory</h3>
                    <p>
                      Hundreds of naira disappear monthly with no visibility
                      into stock levels and customer orders.
                    </p>
                  </div>
                </div>
                <div className="problem-item">
                  <span className="problem-num">02</span>
                  <div className="problem-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  </div>
                  <div>
                    <h3>Order Chaos</h3>
                    <p>
                      Managing multiple customer orders on paper creates delays,
                      missed deliveries, and angry customers.
                    </p>
                  </div>
                </div>
                <div className="problem-item">
                  <span className="problem-num">03</span>
                  <div className="problem-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3>Cash Flow Blindness</h3>
                    <p>
                      Without proper records, vendors can&apos;t track profits,
                      expenses, or make smart business decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="problem-image">
              <div className="dash-float f-order">
                <span className="df-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </span>
                New Order
              </div>

              <div className="dash-mock">
                <div className="dash-head">
                  <span className="dash-title">Inventory Dashboard</span>
                  <span className="dash-live">
                    <span className="dot"></span>Live
                  </span>
                </div>

                <div className="dash-row">
                  <div className="dash-row-info">
                    <span className="dash-swatch"></span>
                    <div>
                      <div className="dash-item-name">Rice, 5kg bag</div>
                      <div className="dash-item-meta">Orders: 12 today</div>
                    </div>
                  </div>
                  <span className="dash-stock-pill ok">Stock: 45</span>
                </div>

                <div className="dash-row">
                  <div className="dash-row-info">
                    <span className="dash-swatch"></span>
                    <div>
                      <div className="dash-item-name">Groundnut Oil</div>
                      <div className="dash-item-meta">Orders: 8 today</div>
                    </div>
                  </div>
                  <span className="dash-stock-pill low">Stock: 3</span>
                </div>

                <div className="dash-row">
                  <div className="dash-row-info">
                    <span className="dash-swatch"></span>
                    <div>
                      <div className="dash-item-name">Seasoning Cubes</div>
                      <div className="dash-item-meta">Orders: 21 today</div>
                    </div>
                  </div>
                  <span className="dash-stock-pill ok">Stock: 60</span>
                </div>

                <div className="dash-footer">
                  <div className="dash-stat">
                    <div className="dash-stat-label">Sales Today</div>
                    <div className="dash-stat-value">₦45,200</div>
                  </div>
                  <div className="dash-stat">
                    <div className="dash-stat-label">Pending</div>
                    <div className="dash-stat-value">5 orders</div>
                  </div>
                </div>
              </div>

              <div className="dash-float f-alert">
                <span className="df-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                    <path d="M3 8v8l9 5 9-5V8" />
                  </svg>
                </span>
                Low Stock Alert
              </div>

              <div className="dash-float f-sales">
                <span className="df-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                ₦45,200 Today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="values-section">
        <div className="wrap">
          <div className="values-header reveal">
            <h2>
              Our <span className="hl">Core Values</span>
            </h2>
            <p>
              The principles that guide how we build, serve, and scale VendorHub
              for vendors across Africa.
            </p>
          </div>
          <div className="values-grid reveal-stagger">
            <div className="value-card">
              <div className="value-icon">
                {" "}
                <Heart className="h-6 w-6" />
              </div>
              <h3>Vendor Obsession</h3>
              <p>
                Everything we build starts with listening to vendors. Your pain
                points drive our roadmap, not trends.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                {" "}
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3>Trust & Safety</h3>
              <p>
                Your business data is sacred. Bank-level encryption, daily
                backups, and zero data sharing—guaranteed.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                {" "}
                <Zap className="h-6 w-6" />
              </div>
              <h3>Relentless Speed</h3>
              <p>
                Slow software loses sales. VendorHub is built for instant order
                entry, tracking, and customer updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="mission-section">
        <div className="wrap reveal">
          <div className="mission-badge">✨</div>
          <h2>
            Our <span className="hl">North Star</span>
          </h2>
          <p className="mission-quote">
            "To make every serious vendor business in Nigeria more profitable,
            less stressful, and loved by customers—using technology that just
            works and costs almost nothing."
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Run Smarter?</h2>
          <p>
            Join the fastest-growing network of Nigerian vendors scaling with
            VendorHub. Start free, cancel anytime.
          </p>
          <a href="/signup" className="cta-btn">
            <Rocket size={24} /> Start Free Today
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="brand">
                <span className="mark"></span>VendorHub
              </div>
              <p className="tagline">
                The all-in-one platform for Nigerian vendors. Manage orders,
                inventory, and customer relationships in one place.
              </p>
              <span className="footer-phone">+234 707 647 3776</span>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link href="/">Home</Link>
              <a href="/about">About</a>
              <a href="/">Features</a>
              <a href="/">Pricing</a>
              <a href="/">Blog</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/about">About VendorHub</a>
              <a href="/">Become a Partner</a>
              <a href="/">Contact Us</a>
              <a href="/">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
              <a href="/">Data Protection</a>
              <a href="/">Status</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 VendorHub Nigeria. All rights reserved.</span>
            <span>NDPR Compliant • ISO Certified</span>
          </div>
        </div>
      </footer>
    </>
  );
}
