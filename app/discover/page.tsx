"use client";

import { ClientScripts } from "@/components/client-scripts";
import NavbarMobile from "@/components/NavbarMobile";
import { useDirectoryStore } from "@/store/directoryStore";
import { Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./discover.css";

const planLabels: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

export default function DiscoverPage() {
  const {
    vendors,
    isLoading,
    fetchDirectory: loadDirectory,
  } = useDirectoryStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationFilterActive, setLocationFilterActive] = useState(false);

  const nigerianStates = [
    "Lagos",
    "Abuja",
    "FCT",
    "Rivers",
    "Kano",
    "Oyo",
    "Delta",
    "Edo",
    "Kaduna",
    "Imo",
    "Plateau",
    "Anambra",
    "Enugu",
    "Abia",
    "Cross River",
    "Ogun",
    "Ondo",
    "Osun",
    "Ekiti",
    "Kwara",
    "Kogi",
    "Benue",
    "Niger",
    "Sokoto",
    "Kebbi",
    "Zamfara",
    "Katsina",
    "Jigawa",
    "Bauchi",
    "Gombe",
    "Adamawa",
    "Taraba",
    "Yobe",
    "Borno",
    "Nasarawa",
    "Ebonyi",
    "Akwa Ibom",
    "Bayelsa",
  ];

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Location services are not available on this device.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          const state = data.address?.state || data.address?.county;

          const matchedState = nigerianStates.find((s) =>
            state?.toLowerCase().includes(s.toLowerCase()),
          );

          if (matchedState) {
            setUserLocation(matchedState);
            setLocationFilterActive(true);
          } else {
            alert("Couldn't determine your state. Try searching manually.");
          }
        } catch {
          alert("Could not determine your location.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Location permission denied.");
        setIsLocating(false);
      },
    );
  };

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();

    vendors.forEach((v) => {
      (v.categories ?? []).forEach((c) => cats.add(c));
    });

    return ["All", ...Array.from(cats)];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || v.categories.includes(category);
      const matchesLocation =
        !locationFilterActive ||
        !userLocation ||
        v.address.toLowerCase().includes(userLocation.toLowerCase());
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [vendors, search, category, locationFilterActive, userLocation]);

  return (
    <>
      <ClientScripts />
      <NavbarMobile />
      <div className="discover-hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <button
          className="discover-location-btn"
          onClick={handleUseMyLocation}
          disabled={isLocating}
        >
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
          {isLocating
            ? "Locating..."
            : locationFilterActive
              ? userLocation
              : "Near Me"}
        </button>
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
      {locationFilterActive && (
        <div className="wrap" style={{ paddingTop: 12 }}>
          <button
            className="discover-clear-location"
            onClick={() => setLocationFilterActive(false)}
          >
            Showing vendors in {userLocation} · Clear filter ✕
          </button>
        </div>
      )}
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
          <div className="vendor-grid">
            {filteredVendors.map((vendor: any) => {
              const safeRating =
                typeof vendor.avgRating === "number" &&
                Number.isFinite(vendor.avgRating)
                  ? vendor.avgRating
                  : 0;
              const safeReviewCount =
                typeof vendor.reviewCount === "number" &&
                Number.isFinite(vendor.reviewCount)
                  ? vendor.reviewCount
                  : 0;
              const safeInitial = vendor.name?.[0] || "V";

              return (
                <Link
                  href={`/store/${vendor.slug}`}
                  className="vendor-card-v3"
                  key={vendor.id}
                >
                  <div className="vendor-card-v3-image">
                    {vendor.logoUrl ? (
                      <img src={vendor.logoUrl} alt={vendor.name} />
                    ) : (
                      <div className="vendor-card-v3-fallback">
                        {vendor.name[0]}
                      </div>
                    )}

                    <div className="vendor-card-v3-badges-top">
                      <span
                        className={`v3-badge availability ${vendor.isOpenToday ? "open" : "closed"}`}
                      >
                        <span className="dot"></span>
                        {vendor.isOpenToday ? "Open" : "Closed"}
                      </span>
                      <span className={`v3-badge plan plan-${vendor.plan}`}>
                        {planLabels[vendor.plan]}
                      </span>
                    </div>

                    {vendor.isVerified && (
                      <span className="v3-badge verified">
                        <Check />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="vendor-card-v3-body">
                    <div className="vendor-card-v3-rating">
                      <span
                        className="stars"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, index) => {
                          const rating = Math.round(vendor.avgRating);

                          return (
                            <Star
                              key={index}
                              size={16}
                              strokeWidth={2}
                              fill={index < rating ? "currentColor" : "none"}
                            />
                          );
                        })}
                      </span>
                      <span className="review-count">
                        ({vendor.reviewCount})
                      </span>
                    </div>

                    <div className="vname">
                      {vendor.shortName || vendor.name}
                    </div>
                    <div className="vendor-card-v3-address">
                      {vendor.address}
                    </div>

                    {vendor.branchCount > 1 && (
                      <div className="vendor-card-v3-branches">
                        {vendor.branchCount} locations
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
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
