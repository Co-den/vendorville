"use client";

import NavbarMobile from "@/components/NavbarMobile";
import { useDirectoryStore } from "@/store/directoryStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./discover.css";

export default function DiscoverPage() {
  const { vendors, isLoading, fetchDirectory } = useDirectoryStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchDirectory();
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    vendors.forEach((v) => v.categories.forEach((c) => cats.add(c)));
    return ["All", ...Array.from(cats)];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || v.categories.includes(category);
      return matchesSearch && matchesCategory;
    });
  }, [vendors, search, category]);

  return (
    <>
      <NavbarMobile />
      <div className="discover-hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="wrap discover-hero-content">
          <span className="discover-eyebrow">✦ Discover Vendors</span>
          <h1>Shop from Nigerian vendors near you</h1>
          <p>
            Browse verified online vendors and order directly from their
            storefronts.
          </p>

          <div className="discover-search-bar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="discover-categories">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`discover-cat-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <div className="spinner"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--gray)",
              padding: "60px 0",
            }}
          >
            No vendors found. Try a different search or category.
          </p>
        ) : (
          <div className="discover-grid">
            {filteredVendors.map((vendor) => (
              <Link
                href={`/store/${vendor.slug}`}
                className="discover-card"
                key={vendor.id}
              >
                <div className="discover-card-logo">
                  {vendor.logoUrl ? (
                    <img src={vendor.logoUrl} alt={vendor.name} />
                  ) : (
                    vendor.name[0]
                  )}
                </div>
                <div className="discover-card-name">
                  {vendor.shortName || vendor.name}
                </div>
                <div className="discover-card-meta">{vendor.address}</div>
                <div className="discover-card-footer">
                  <span className="discover-card-count">
                    {vendor.productCount} products
                  </span>
                  {vendor.categories.slice(0, 1).map((c) => (
                    <span className="discover-card-tag" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
        
      </div>
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
    </>
  );
}
