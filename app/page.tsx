import { ClientScripts } from "@/components/client-scripts";
import NavbarMobile from "@/components/NavbarMobile";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedVendors() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/store/directory`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.businesses || []).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredVendors = await getFeaturedVendors();

  return (
    <>
      <ClientScripts />
      <NavbarMobile />
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="wrap hero-grid">
          <div className="hero-text">
            <h1>
              Run Your Vendor Business the <span className="hl">Smart Way</span>
            </h1>
            <p className="lead">
              The all-in-one POS &amp; inventory platform for Nigerian market
              vendors. Track stock, manage sales, and send Email, SMS &amp;
              WhatsApp alerts all from your phone.
            </p>
            <div className="hero-ctas">
              <Link className="btn-white" href="/">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="6,4 20,12 6,20" />
                </svg>
                Watch Live Demo
              </Link>
              <Link className="btn-outline" href="/discover">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Find Nearby Vendors
              </Link>
            </div>
            <div className="trust-row">
              <div className="trust-item">
                <b>500+</b> Vendors
              </div>
              <div className="trust-item">
                <b>4.9★</b> Rating
              </div>
              <div className="trust-item">
                <b>98%</b> Satisfaction
              </div>
            </div>
          </div>
        </div>

        <div className="mock-wrap">
          <div className="mock-card">
            <div className="mock-head">
              <span>New Order</span>
              <span className="pos-pill">POS</span>
            </div>
            <div className="item-row">
              <span className="qty">2x</span>
              <span className="item-name">Rice, 5kg bag</span>
              <span className="item-price">₦8,500</span>
            </div>
            <div className="item-row">
              <span className="qty">1x</span>
              <span className="item-name">Groundnut oil</span>
              <span className="item-price">₦4,200</span>
            </div>
            <div className="item-row">
              <span className="qty">3x</span>
              <span className="item-name">Seasoning cubes</span>
              <span className="item-price">₦900</span>
            </div>
            <div className="item-row">
              <span className="qty">1x</span>
              <span className="item-name">Maggi seasoning pack</span>
              <span className="item-price">₦1,600</span>
            </div>
            <div className="mock-footer">
              <div className="mock-stat">
                <div className="ms-label">Total</div>
                <div className="ms-value">₦15,200</div>
              </div>
              <div className="mock-stat accent">
                <div className="ms-label">Status</div>
                <div className="ms-value">Ready</div>
              </div>
            </div>
          </div>

          <div className="float-card fc-received">
            <div className="fc-body">
              <span className="fc-icon">
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
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">Order Received</span>
              </span>
            </div>
          </div>

          <div className="float-card fc-whatsapp">
            <div className="fc-body">
              <span className="fc-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9c-.1.1-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7.1 7.1 0 01-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4a.5.5 0 000-.4c-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3 2.7 2.7 0 00-.8 2 4.7 4.7 0 001 2.5 10.8 10.8 0 004.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 001.5.1 2.5 2.5 0 001.6-1.1 2 2 0 00.1-1.1c-.1-.1-.2-.2-.4-.3z" />
                </svg>
              </span>
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">WhatsApp Alert</span>
              </span>
            </div>
          </div>

          <div className="float-card fc-inventory">
            <div className="fc-body">
              <span className="fc-icon">
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
              </span>
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">Inventory Alert</span>
              </span>
            </div>
          </div>

          <div className="float-card fc-delivery">
            <div className="fc-body">
              <span className="fc-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="6" width="14" height="11" rx="1" />
                  <path d="M15 9h4l3 3v5h-7z" />
                  <circle cx="6" cy="19" r="2" />
                  <circle cx="18" cy="19" r="2" />
                </svg>
              </span>
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">Delivery SMS</span>
              </span>
            </div>
          </div>

          <div className="float-card alert">
            <div className="fc-body">
              <span className="fc-icon">
                <span className="dot"></span>
              </span>
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">Low Stock Alert</span>
              </span>
            </div>
          </div>

          <div className="float-card stock">
            <div className="fc-body">
              <span className="fc-icon">
                <span className="dot"></span>
              </span>
              <span className="fc-text">
                <span className="fc-label">Notification</span>
                <span className="fc-title">Restock Complete</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <section id="features">
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ Features</span>
          </div>
          <div className="sec-head reveal">
            <h2>
              Everything You Need to <span className="hl">Grow</span>
            </h2>
            <p>
              The all-in-one platform to manage and scale your vendor business.
            </p>
          </div>
          <div className="feat-grid reveal-stagger">
            <div className="feat-card">
              <div className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="8" y2="11" />
                  <line x1="12" y1="11" x2="12" y2="11" />
                  <line x1="16" y1="11" x2="16" y2="11" />
                  <line x1="8" y1="15" x2="8" y2="15" />
                  <line x1="12" y1="15" x2="12" y2="15" />
                  <line x1="16" y1="15" x2="16" y2="15" />
                </svg>
              </div>
              <h3>Lightning-Fast POS</h3>
              <p>
                Process orders in seconds. Digital receipts, barcode scanning,
                cash and mobile money.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
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
              <h3>Smart Inventory</h3>
              <p>
                Track goods, shelf items, and stock. Get shelf alerts via SMS
                and WhatsApp.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
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
              </div>
              <h3>Email, SMS &amp; WhatsApp Alerts</h3>
              <p>
                Auto-notify customers: &quot;Your order is ready.&quot; Build
                loyalty automatically.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
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
              </div>
              <h3>Real Analytics</h3>
              <p>
                Daily sales, top items, and stock trends. Make data-driven
                decisions.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3>Shelf Management</h3>
              <p>Organize, track, and monitor items on shelves in real time.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="6" width="14" height="11" rx="1" />
                  <path d="M15 9h4l3 3v5h-7z" />
                  <circle cx="6" cy="19" r="2" />
                  <circle cx="18" cy="19" r="2" />
                </svg>
              </div>
              <h3>Rider Dispatch</h3>
              <p>
                Assign a delivery to a rider and track it in real time, end to
                end.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
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
              <h3>Payment Approvals</h3>
              <p>
                Verify and approve payments instantly with secure, built-in
                validation.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  <circle cx="17" cy="13" r="1.5" />
                </svg>
              </div>
              <h3>Smart Expense Tracking</h3>
              <p>
                Monitor daily spending, categorize expenses, and maintain
                healthy cash flow.
              </p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="7" y1="15" x2="11" y2="15" />
                </svg>
              </div>
              <h3>Virtual Payment Accounts</h3>
              <p>
                Get unique virtual accounts for each store location for seamless
                reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testi-band" id="testimonials">
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ Customer Stories</span>
          </div>
          <div className="sec-head reveal">
            <h2>
              Loved by <span className="hl">Vendors</span> across Nigeria
            </h2>
            <p>
              Real stories from real business owners who&apos;ve transformed
              their operations with VendorVille.
            </p>
          </div>
          <div className="stat-pill-row reveal-stagger">
            <span className="stat-pill">
              <b>500+</b> Verified Vendors
            </span>
            <span className="stat-pill">
              <b>4.9★</b> Average Rating
            </span>
            <span className="stat-pill">
              <b>98%</b> Satisfaction Rate
            </span>
          </div>
          <div className="testi-grid reveal-stagger">
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;I don&apos;t lose stock anymore — I get an alert before I
                run out of anything.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">NM</div>
                <div>
                  <div className="testi-name">Ngozi M.</div>
                  <div className="testi-role">Provision Store, Enugu</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Managing multiple stalls used to be chaos. Now it&apos;s
                one dashboard for everything.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">CJ</div>
                <div>
                  <div className="testi-name">Chidi J.</div>
                  <div className="testi-role">Suya Spot, Lagos</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Customers get an alert the moment their order is ready.
                It&apos;s changed how they see my shop.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">BK</div>
                <div>
                  <div className="testi-name">Blessing K.</div>
                  <div className="testi-role">Fabrics, Abuja</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;The most complex parts of running a vendor business just
                became simple.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">FA</div>
                <div>
                  <div className="testi-name">Femi A.</div>
                  <div className="testi-role">Electronics, Ibadan</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;The payout is fast and I get paid on time for wholesale
                orders now.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">TU</div>
                <div>
                  <div className="testi-name">Tayo U.</div>
                  <div className="testi-role">Hardware, Kano</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Affordable and set up was quick. The support team actually
                understands vendors here.&quot;
              </p>
              <div className="testi-who">
                <div className="avatar">GO</div>
                <div>
                  <div className="testi-name">Grace O.</div>
                  <div className="testi-role">Cosmetics, Rivers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-band" id="discover">
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ Featured Vendors</span>
          </div>
          <div className="sec-head reveal">
            <h2>Discover Amazing Vendors</h2>
            <p>Real vendors selling right now on VendorVille.</p>
          </div>

          {featuredVendors.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#667085",
                padding: "20px 0",
              }}
            >
              New vendors are joining every day check back soon.
            </p>
          ) : (
            <div className="vendor-grid reveal-stagger">
              {featuredVendors.map((vendor: any) => (
                <div className="vendor-card" key={vendor.id}>
                  <div className="vendor-logo">
                    {vendor.logoUrl ? (
                      <img
                        src={vendor.logoUrl}
                        alt={vendor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "inherit",
                        }}
                      />
                    ) : (
                      vendor.name[0]
                    )}
                  </div>
                  <div className="vendor-info">
                    <div className="vname">
                      {vendor.shortName || vendor.name}
                    </div>
                    <div className="vrating">
                      {vendor.productCount} products · {vendor.address}
                    </div>
                  </div>
                  <Link className="vendor-view" href={`/store/${vendor.slug}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/discover" className="btn-outline">
              See All Vendors
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ Pricing</span>
          </div>
          <div className="sec-head reveal">
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free. Upgrade anytime. Cancel anytime.</p>
          </div>
          <div className="toggle">
            <div className="toggle-pill">
              <span className="active">Monthly</span>
              <span>Yearly</span>
            </div>
          </div>
          <div className="price-grid reveal-stagger">
            <div className="price-card">
              <span className="badge-pop">14 days free trial</span>
              <div className="plan-name">Starter</div>
              <div className="plan-sub">Suitable for vendors</div>
              <div className="plan-price">
                ₦5,500<span>/month</span>
              </div>
              <ul className="plan-list">
                <li>1 Business, 1 Stall/Front</li>
                <li>Up to 200 POS order items/month</li>
                <li>Up to 50 orders per customer</li>
                <li>Standard POS &amp; Inventory</li>
                <li>Up to 50 Customers per store</li>
                <li>5 Shelf/Rack Compartments</li>
                <li>1 Staff per Store</li>
                <li>Email &amp; WhatsApp Sharing</li>
              </ul>
              <Link className="p-b" href="/auth/signup?plan=starter">
                Start Starter
              </Link>
            </div>
            <div className="price-card pro">
              <span className="badge-pop2">MOST POPULAR</span>
              <div className="plan-name">Professional</div>
              <div className="plan-sub">Built for growing vendors</div>
              <div className="plan-price">
                ₦10,500<span>/month</span>
              </div>
              <ul className="plan-list">
                <li>2 Businesses, 2 Stores per Brand</li>
                <li>Up to 400 POS order items/month</li>
                <li>Up to 100 orders per customer</li>
                <li>Gift Card &amp; Loyalty Points</li>
                <li>Up to 120 Customers per store</li>
                <li>15 Shelf/Rack Compartments</li>
                <li>3 Staff per Store</li>
                <li>Email, SMS &amp; WhatsApp Alerts</li>
              </ul>
              <Link className="plan-btn" href="/auth/signup?plan=professional">
                Start Professional
              </Link>
            </div>
            <div className="price-card">
              <div className="plan-name">Enterprise Suite</div>
              <div className="plan-sub">For enterprise-level vendors</div>
              <div className="plan-price">
                ₦15,500<span>/month</span>
              </div>
              <ul className="plan-list">
                <li>Unlimited Businesses &amp; Stalls</li>
                <li>Unlimited POS order items</li>
                <li>Unlimited orders per store</li>
                <li>Unlimited Staff per Store</li>
                <li>Unlimited Shelf/Rack Compartments</li>
                <li>AI-Powered Order Creation</li>
                <li>Dispatch Rider Feature</li>
                <li>Email, SMS &amp; WhatsApp Alerts</li>
              </ul>
              <Link className="plan-btn" href="/auth/signup?plan=premium">
                Choose Premium
              </Link>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "44px 0 18px" }}>
            <span className="tag-pill">✦ Compare Plans</span>
          </div>
          <div className="sec-head reveal">
            <h2>Full Feature Comparison</h2>
            <p>A detailed look at what each plan includes.</p>
          </div>
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Enterprise Suite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="group-row">
                  <td colSpan={4}>Core Limits</td>
                </tr>
                <tr>
                  <td>Businesses (Fixed)</td>
                  <td>1</td>
                  <td>2</td>
                  <td className="dash">Unlimited</td>
                </tr>
                <tr>
                  <td>Stores per Business (Fixed)</td>
                  <td>1</td>
                  <td>2</td>
                  <td className="dash">Unlimited</td>
                </tr>
                <tr>
                  <td>POS Order Items / Month</td>
                  <td>Up to 200</td>
                  <td>Up to 400</td>
                  <td className="dash">Unlimited</td>
                </tr>
                <tr>
                  <td>Shelf/Rack Compartments (Fixed)</td>
                  <td>5</td>
                  <td>15</td>
                  <td className="dash">Unlimited</td>
                </tr>
                <tr className="group-row">
                  <td colSpan={4}>Marketing &amp; Engagement</td>
                </tr>
                <tr>
                  <td>Gift Cards &amp; Loyalty</td>
                  <td className="dash">—</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                </tr>
                <tr>
                  <td>Bulk Alerts</td>
                  <td className="dash">Email &amp; WhatsApp</td>
                  <td>Email, SMS &amp; WhatsApp</td>
                  <td>Email, SMS &amp; WhatsApp Voice</td>
                </tr>
                <tr className="group-row">
                  <td colSpan={4}>Operations</td>
                </tr>
                <tr>
                  <td>Standard POS &amp; Inventory</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                </tr>
                <tr>
                  <td>Dispatch Rider Feature</td>
                  <td className="dash">—</td>
                  <td className="dash">—</td>
                  <td className="check">✓</td>
                </tr>
                <tr className="group-row">
                  <td colSpan={4}>AI &amp; Charges</td>
                </tr>
                <tr>
                  <td>AI-Powered Order Creation</td>
                  <td className="dash">—</td>
                  <td className="dash">—</td>
                  <td className="check">✓</td>
                </tr>
                <tr>
                  <td>Payroll</td>
                  <td className="dash">—</td>
                  <td className="dash">—</td>
                  <td>Full Suite</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ FAQ</span>
          </div>
          <div className="sec-head reveal">
            <h2>
              Frequently Asked <span className="hl">Questions</span>
            </h2>
            <p>
              Got questions? We&apos;ve got answers. Everything you need to know
              about setting up and using VendorVille.
            </p>
          </div>
          <div className="faq-list reveal-stagger">
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">
                  Do I need internet to use VendorVille?
                </span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  A connection is needed to sync sales and stock in real time,
                  but core POS functions keep working briefly offline and sync
                  once you&apos;re back online.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">Can I use it on my phone?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Yes — VendorVille is fully mobile. Run your stall from an
                  Android phone, iPhone, or tablet, no computer required.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">Is my data secure?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Yes. Bank-level encryption and daily backups keep your sales
                  and stock records secure at all times.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">Can I switch plans anytime?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Upgrade or downgrade whenever you like. Plan changes are
                  prorated automatically with no penalties.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">Do you offer training?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Every new account gets a free onboarding walkthrough, plus
                  access to video guides and WhatsApp support.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">What payment methods do you accept?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Cards, bank transfer, and mobile money are all supported for
                  both subscriptions and in-app customer payments.
                </p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-head">
                <span className="q">Can I export my data?</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Yes — export your sales, inventory, and customer records to
                  CSV at any time from your dashboard settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="navy-band">
        <div className="wrap">
          <div className="sec-head reveal" style={{ marginBottom: "44px" }}>
            <h2>
              We&apos;re Growing Across <span className="hl">Nigeria</span>
            </h2>
            <p>
              VendorVille partners with market vendors in major cities and
              states across Nigeria.
            </p>
          </div>
          <div className="state-grid reveal-stagger">
            <div className="state-chip">Lagos</div>
            <div className="state-chip">Abuja (FCT)</div>
            <div className="state-chip">Rivers</div>
            <div className="state-chip">Kano</div>
            <div className="state-chip">Oyo</div>
            <div className="state-chip">Delta</div>
            <div className="state-chip">Edo</div>
            <div className="state-chip">Kaduna</div>
            <div className="state-chip">Imo</div>
            <div className="state-chip">Plateau</div>
            <div className="state-chip">Anambra</div>
            <div className="state-chip">Enugu</div>
            <div className="state-chip">Abia</div>
            <div className="state-chip">Cross River</div>
          </div>
          <div className="more-soon">✦ More states coming soon!</div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <span className="tag-pill">✦ Official Partnerships</span>
          </div>
          <div className="sec-head reveal">
            <h2>
              Trusted by <span className="hl">Leading Organizations</span>
            </h2>
            <p>
              We partner with respected bodies to ensure the highest quality of
              service in the vendor industry.
            </p>
          </div>
          <div className="trust-grid reveal-stagger">
            <div className="trust-org">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
                </svg>
              </div>
              <div className="label">Vendor Association</div>
            </div>
            <div className="trust-org">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8.5 13.5L6 22l6-3 6 3-2.5-8.5" />
                </svg>
              </div>
              <div className="label">Safety Standards</div>
            </div>
            <div className="trust-org">
              <div className="icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V9l7-6 7 6v12" />
                  <line x1="9" y1="21" x2="9" y2="12" />
                  <line x1="15" y1="21" x2="15" y2="12" />
                </svg>
              </div>
              <div className="label">Local Chambers</div>
            </div>
            <div className="trust-org">
              <div className="icon">
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
                  <path d="M12 2a15 15 0 010 20 15 15 0 010-20z" />
                </svg>
              </div>
              <div className="label">Commerce Hub</div>
            </div>
          </div>
        </div>
      </section>

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
                orders, manage stock, and send Email, SMS &amp; WhatsApp alerts,
                all from your phone.
              </p>
              <span className="footer-phone">+234 903 935 4723</span>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <a href="/blog">Blog</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/about">About VendorVille</a>
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
              <a href="/policy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 VendorVille Nigeria. All rights reserved.</span>
            <span>Nigeria Data Protection Act (NDPR) compliant</span>
          </div>
        </div>
      </footer>
    </>
  );
}
