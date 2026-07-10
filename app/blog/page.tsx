"use client";

import NavbarMobile from "@/components/NavbarMobile";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import "./blog.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-fraunces",
});

// Mock blog data
const mockBlogPosts = [
  {
    id: 1,
    title:
      "How to Scale Your Vendor Business from ₦100K to ₦1M Monthly Revenue",
    excerpt:
      "Learn proven strategies that 200+ Nigerian vendors use to scale their businesses. From inventory management to customer retention, discover the blueprint for exponential growth.",
    author: "Chioma Adeyemi",
    authorRole: "Business Coach",
    date: "July 3, 2026",
    category: "Growth",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    featured: true,
    readTime: "8 min read",
    content:
      "Scaling a vendor business requires a multi-faceted approach combining smart operations, customer focus, and strategic partnerships. In this comprehensive guide, we share the exact strategies used by top performers on VendorVille...",
  },
  {
    id: 2,
    title: "The Complete Guide to Using VendorVille Analytics to Boost Sales",
    excerpt:
      "Unlock the power of data-driven decisions. See how to interpret analytics dashboards, identify trends, and optimize your product mix for maximum profitability.",
    author: "Tunde Okoro",
    authorRole: "Analytics Expert",
    date: "July 1, 2026",
    category: "Tools & Tips",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    featured: false,
    readTime: "6 min read",
    content:
      "Analytics are the backbone of modern vendor operations. This guide walks you through VendorVille's powerful analytics features...",
  },
  {
    id: 3,
    title: "Building Trust with Customers: Retention Strategies That Work",
    excerpt:
      "Customer retention is 5-25x cheaper than acquisition. Learn the psychological principles and practical tactics that successful vendors use to build loyal customer bases.",
    author: "Zainab Mohammed",
    authorRole: "Customer Success Manager",
    date: "June 28, 2026",
    category: "Customer Retention",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    featured: false,
    readTime: "7 min read",
    content:
      "Building trust is the foundation of any successful vendor business. Discover the proven frameworks that turn one-time buyers into lifetime customers...",
  },
  {
    id: 4,
    title:
      "Competitive Pricing Without Killing Your Margins: A Data-Driven Approach",
    excerpt:
      "Price wars destroy businesses. Learn how to position your products competitively while maintaining healthy profit margins through intelligent pricing strategies.",
    author: "Kunle Obi",
    authorRole: "Business Strategist",
    date: "June 25, 2026",
    category: "Pricing",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    featured: false,
    readTime: "5 min read",
    content:
      "Pricing is one of the most critical decisions vendors make. This guide provides a framework for pricing that balances competitiveness with profitability...",
  },
  {
    id: 5,
    title: "Seasonal Planning: How to Prepare Your Business for Peak Demand",
    excerpt:
      "Peak seasons can make or break your annual revenue. Learn inventory planning, staffing strategies, and marketing tactics to maximize during high-demand periods.",
    author: "Ada Nwankwo",
    authorRole: "Operations Manager",
    date: "June 22, 2026",
    category: "Operations",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    featured: false,
    readTime: "9 min read",
    content:
      "Seasonal patterns significantly impact vendor businesses. This comprehensive guide helps you prepare, plan, and profit during peak demand seasons...",
  },
  {
    id: 6,
    title:
      "Logistics & Delivery Excellence: The Game-Changer for Vendor Growth",
    excerpt:
      "Fast, reliable delivery is a competitive advantage. Explore logistics partnerships, fulfillment optimization, and customer communication strategies that reduce churn.",
    author: "Emeka Eze",
    authorRole: "Logistics Specialist",
    date: "June 19, 2026",
    category: "Growth",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    featured: false,
    readTime: "6 min read",
    content:
      "Logistics excellence separates thriving vendors from struggling ones. Learn how to optimize your delivery operations...",
  },
  {
    id: 7,
    title:
      "Digital Marketing on a Shoestring Budget: Proven Tactics for Vendors",
    excerpt:
      "You don't need a huge budget to grow online. Discover free and low-cost marketing strategies that successful Nigerian vendors use to acquire customers.",
    author: "Blessing Okafor",
    authorRole: "Marketing Director",
    date: "June 16, 2026",
    category: "Marketing",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    featured: false,
    readTime: "8 min read",
    content:
      "Digital marketing doesn't require a Fortune 500 budget. This guide shares cost-effective strategies for vendor growth...",
  },
  {
    id: 8,
    title:
      "Financial Planning for Vendors: Budgeting, Taxes, and Profit Maximization",
    excerpt:
      "Many vendors fail due to poor financial management. Learn accounting basics, tax obligations, and profit-maximizing strategies tailored for vendor businesses.",
    author: "Chinedu Amadi",
    authorRole: "Financial Advisor",
    date: "June 13, 2026",
    category: "Finance",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    featured: false,
    readTime: "10 min read",
    content:
      "Financial literacy is critical for vendor success. This complete guide covers budgeting, tax planning, and profit optimization...",
  },
];

const categories = [
  "All",
  "Growth",
  "Tools & Tips",
  "Customer Retention",
  "Pricing",
  "Operations",
  "Marketing",
  "Finance",
];

const categoryStyles: Record<string, { color: string; icon: ReactNode }> = {
  Growth: {
    color: "#3a844f",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  "Tools & Tips": {
    color: "#3a6ce0",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  "Customer Retention": {
    color: "#d64577",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
      </svg>
    ),
  },
  Pricing: {
    color: "#f0a23a",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.17H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.82 0l4.6-4.6a2 2 0 000-2.82z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    ),
  },
  Operations: {
    color: "#0e9488",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="17" rx="2" />
        <path d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="16" y2="15" />
      </svg>
    ),
  },
  Marketing: {
    color: "#8b5cf6",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11v3a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z" />
        <path d="M17.5 8.5a5 5 0 010 7" />
        <path d="M20 6a9 9 0 010 12" />
      </svg>
    ),
  },
  Finance: {
    color: "#1f3a5f",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-1" />
        <path d="M21 12a1 1 0 000 2h-4a2 2 0 010-4h4a1 1 0 010 2z" />
      </svg>
    ),
  },
};

function PostThumb({ category }: { category: string }) {
  const style = categoryStyles[category] ?? categoryStyles.Growth;
  return (
    <div
      className="post-thumb"
      style={{
        background: `linear-gradient(135deg, ${style.color}, ${style.color}cc)`,
      }}
    >
      <span className="post-thumb-icon">{style.icon}</span>
    </div>
  );
}

export default function BlogPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(mockBlogPosts);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let filtered = mockBlogPosts;

    if (activeCategory !== "All") {
      filtered = filtered.filter((post) => post.category === activeCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredPosts(filtered);
  }, [activeCategory, searchQuery]);

  const featuredPost = mockBlogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className={fraunces.variable}>
      <NavbarMobile />
      <section className="blog-hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="wrap">
          <span className="hero-eyebrow">✦ VendorVille Blog</span>
          <h1 className="hero-title">Insights for Growing Vendors</h1>
          <p className="hero-subtitle">
            Read stories and best practices from industry leaders. Learn growth
            strategies, tools, and tactics to scale your vendor business.
          </p>
        </div>
      </section>

      <section className="blog-content">
        <div className="wrap">
          <div className="blog-main">
            {/* Featured Post */}
            {featuredPost && (
              <div className="featured-section">
                <div className="featured-card">
                  <div className="featured-image">
                    <PostThumb category={featuredPost.category} />
                    <span className="featured-badge">Featured</span>
                  </div>
                  <div className="featured-content">
                    <div className="featured-meta">
                      <span className="category-tag">
                        {featuredPost.category}
                      </span>
                      <span className="read-time">{featuredPost.readTime}</span>
                    </div>
                    <h2 className="featured-title">{featuredPost.title}</h2>
                    <p className="featured-excerpt">{featuredPost.excerpt}</p>
                    <div className="featured-footer">
                      <div className="author-info">
                        <div className="author-avatar">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <div className="author-name">
                            {featuredPost.author}
                          </div>
                          <div className="author-role">
                            {featuredPost.authorRole}
                          </div>
                        </div>
                      </div>
                      <span className="post-date">{featuredPost.date}</span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.id}`}
                      className="read-btn"
                    >
                      Read Full Article
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="posts-section">
              {regularPosts.length > 0 ? (
                regularPosts.map((post) => (
                  <article key={post.id} className="blog-post-card">
                    <div className="post-image">
                      <PostThumb category={post.category} />
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="category">{post.category}</span>
                        <span className="date">{post.date}</span>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <div className="post-footer">
                        <div className="author-info">
                          <div className="avatar">{post.author.charAt(0)}</div>
                          <div>
                            <div className="name">{post.author}</div>
                            <div className="role">{post.authorRole}</div>
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`} className="read-more">
                          Read More
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-results">
                  <p>
                    No posts found. Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-card search-card">
              <h4>Search</h4>
              <div className="search-box">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="sidebar-card categories-card">
              <h4>Categories</h4>
              <div className="categories-list">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${activeCategory === category ? "active" : ""}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-card recent-card">
              <h4>Recent Posts</h4>
              <div className="recent-list">
                {mockBlogPosts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="recent-item"
                  >
                    <div className="recent-dot"></div>
                    <div>
                      <div className="recent-title">{post.title}</div>
                      <div className="recent-date">{post.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/blog/share-story" className="sidebar-card write-card">
              <div className="write-icon">✍️</div>

              <h4>Share Your Story</h4>

              <p>
                Have a success story or business tip? Write for the VendorVille
                blog and reach 10,000+ vendors.
              </p>

              <span className="write-btn">Start Writing</span>
            </Link>
          </aside>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="mark"></span>VendorVille
            </div>
            <p className="tagline">
              Empowering Nigerian vendors with smart tools, insights, and
              connections to grow their businesses profitably.
            </p>
            <span className="footer-phone">+234 707 647 3776</span>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/about">About</a>
            <a href="#">Features</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VendorVille Nigeria. All rights reserved.</span>
          <span>Building Nigeria&apos;s vendor economy</span>
        </div>
      </footer>
    </div>
  );
}
