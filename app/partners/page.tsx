'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import './partners.css'

// Mock partner data
const mockPartners = [
  {
    id: 1,
    name: 'Bulk Rice Supplier Ltd',
    location: '3 Industrial Ave, Lagos',
    rating: 4.8,
    reviews: 324,
    services: ['Wholesale', 'Bulk Orders', 'Fast Delivery'],
    category: 'Supplier',
    type: 'verified',
  },
  {
    id: 2,
    name: 'Nigerian Logistics Express',
    location: 'Main Branch, Abuja',
    rating: 4.6,
    reviews: 187,
    services: ['Delivery', 'Same Day', 'Insured'],
    category: 'Delivery',
    type: 'verified',
  },
  {
    id: 3,
    name: 'Prime Foods Wholesale',
    location: '5 Commerce Street, Enugu',
    rating: 4.9,
    reviews: 456,
    services: ['Wholesale', 'Premium', 'Credit Available'],
    category: 'Supplier',
    type: 'premium',
  },
  {
    id: 4,
    name: 'Business Accounting Solutions',
    location: 'Finance Hub, Lagos',
    rating: 4.7,
    reviews: 142,
    services: ['Accounting', 'Tax', 'Compliance'],
    category: 'Services',
    type: 'verified',
  },
  {
    id: 5,
    name: 'Kano Textile Suppliers',
    location: 'Textile District, Kano',
    rating: 4.5,
    reviews: 268,
    services: ['Textiles', 'Fabrics', 'Bulk'],
    category: 'Supplier',
    type: 'new',
  },
  {
    id: 6,
    name: 'Quick Delivery Services',
    location: 'Distribution Center, Port Harcourt',
    rating: 4.4,
    reviews: 201,
    services: ['Delivery', 'Pickup', 'Express'],
    category: 'Delivery',
    type: 'verified',
  },
  {
    id: 7,
    name: 'Capital Finance Group',
    location: 'Finance Park, Abuja',
    rating: 4.8,
    reviews: 195,
    services: ['Business Loans', 'Financing', 'Consulting'],
    category: 'Finance',
    type: 'verified',
  },
  {
    id: 8,
    name: 'Market Fresh Wholesale',
    location: '2 Trade Avenue, Lagos',
    rating: 4.9,
    reviews: 512,
    services: ['Fresh Goods', 'Wholesale', 'Reliable'],
    category: 'Supplier',
    type: 'premium',
  },
]

export default function PartnersPage() {
  const [scrolled, setScrolled] = useState(false)
  const [filteredPartners, setFilteredPartners] = useState(mockPartners)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFilter = (filter: string) => {
    setActiveFilter(filter)
    let filtered = mockPartners

    if (filter !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filter.toLowerCase())
    }

    setFilteredPartners(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = mockPartners.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredPartners(filtered)
  }

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="wrap">
          <Link href="/" className="brand">
            <span className="mark"></span>VendorHub
          </Link>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/partners">Business Partners</a>
            <a href="/about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="nav-cta">Back to Dashboard</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="wrap hero-content">
          <span className="hero-tag">✦ Business Partners</span>
          <h1>
            Grow Your Network. <span className="hl">Scale Your Business.</span>
          </h1>
          <p className="hero-desc">
            Connect with trusted suppliers, logistics partners, and service providers across Nigeria. Expand your vendor network and unlock better rates on wholesale, delivery, and business services.
          </p>
        </div>
      </header>

      <div className="search-section">
        <div className="search-wrap">
          <div className="search-container">
            <div className="search-field">
              <label>Partner Name or Location</label>
              <input
                type="text"
                placeholder="Find suppliers, logistics, services..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>Business Type</label>
              <select>
                <option>All Categories</option>
                <option>Suppliers</option>
                <option>Delivery & Logistics</option>
                <option>Financial Services</option>
                <option>Accounting & Tax</option>
              </select>
            </div>
            <button className="search-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Search Partners
            </button>
          </div>

          <div className="filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
              </svg>
              All
            </button>
            <button
              className={`filter-btn ${activeFilter === 'supplier' ? 'active' : ''}`}
              onClick={() => handleFilter('supplier')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.84-1.01l3.9-5.5c.23-.31.36-.69.36-1.09 0-1.1-.9-2-2-2H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z"></path>
              </svg>
              Suppliers
            </button>
            <button
              className={`filter-btn ${activeFilter === 'delivery' ? 'active' : ''}`}
              onClick={() => handleFilter('delivery')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                <path d="M20 8h-3V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v11h2a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3h6c.5 0 1-.5 1-1v-5c0-1.1-.9-2-2-2zm-1 5h-4v-3h4v3z"></path>
              </svg>
              Delivery & Logistics
            </button>
            <button
              className={`filter-btn ${activeFilter === 'finance' ? 'active' : ''}`}
              onClick={() => handleFilter('finance')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
              </svg>
              Financial Services
            </button>
          </div>

          <div className="results-header">
            <span className="results-count">{filteredPartners.length} PARTNERS AVAILABLE</span>
            <button className="sort-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
              Sort
            </button>
          </div>
        </div>
      </div>

      <section className="search-wrap">
        <div className="partners-grid">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <div className="partner-image">
                {partner.name.charAt(0)}
                {partner.category === 'Supplier' && (
                  <span className="partner-badge">Verified</span>
                )}
              </div>

              <div className="partner-content">
                <div className="partner-header">
                  <div className="partner-rating">
                    <span className="stars">★★★★★</span>
                    <span className="review-count">({partner.reviews} reviews)</span>
                  </div>
                  <h3 className="partner-name">{partner.name}</h3>
                  <p className="partner-location">📍 {partner.location}</p>
                </div>

                <div className="partner-services">
                  {partner.services.map((service, idx) => (
                    <span key={idx} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>

                <div className="partner-footer">
                  <button className="connect-btn">Connect</button>
                  <button className="info-btn" title="View Details">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <path d="M12 17v4"></path>
                      <path d="M12 3v4"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="search-wrap">
        <section className="cta-section">
          <h2>Ready to Expand Your Network?</h2>
          <p>Join thousands of Nigerian vendors scaling with trusted partners. Start connecting today and unlock better rates.</p>
          <button className="cta-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Become a Partner
          </button>
        </section>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="mark"></span>VendorHub
            </div>
            <p className="tagline">
              Connect with trusted business partners and unlock wholesale rates, logistics partnerships, and premium services for your vendor business.
            </p>
            <span className="footer-phone">+234 707 647 3776</span>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="/">Dashboard</a>
            <a href="/partners">Business Partners</a>
            <a href="/about">About Us</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h4>For Partners</h4>
            <a href="#">Become a Partner</a>
            <a href="#">Partner Benefits</a>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            <a href="#">Careers</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VendorHub Nigeria. All rights reserved.</span>
          <span>Building Nigeria&apos;s vendor economy</span>
        </div>
      </footer>
    </>
  )
}
