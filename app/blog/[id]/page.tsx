'use client'

import NavbarMobile from "@/components/NavbarMobile"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import '../blog-details.css'

const mockBlogPosts = [
  {
    id: 1,
    title: 'How to Scale Your Vendor Business from ₦100K to ₦1M Monthly Revenue',
    excerpt: 'Learn proven strategies that 200+ Nigerian vendors use to scale their businesses.',
    author: 'Chioma Adeyemi',
    authorRole: 'Business Coach',
    authorBio: 'Chioma is a business transformation coach with 15+ years of experience helping Nigerian entrepreneurs scale from side hustle to 7-figure operations.',
    date: 'July 3, 2026',
    category: 'Growth',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: '8 min read',
    content: 'Scaling a vendor business from ₦100K to ₦1M monthly revenue is achievable with the right strategy. The journey requires a fundamental shift in how you operate, think about your business, and allocate resources.\n\n## Phase 1: Foundation (₦100K - ₦250K)\n\nThe first phase is about building solid foundations. This means:\n\nSystematize Everything: Document your processes. What works for you won\'t scale with just you. Create standard operating procedures (SOPs) for every repeatable task—product sourcing, customer communication, order fulfillment, and quality control.\n\nMaster Your Unit Economics: Know exactly how much profit you make per transaction. Track your costs meticulously. A vendor making ₦50K monthly with healthy margins is better positioned to scale than one making ₦100K with razor-thin margins.\n\nBuild Customer Loyalty: At this stage, repeat customers are your growth engine. The cost of acquiring a new customer is 5-25x higher than retaining one. Focus on exceptional service, consistent quality, and personalized follow-up.\n\n## Phase 2: Expansion (₦250K - ₦600K)\n\nOnce you\'ve built a solid foundation, expansion becomes possible:\n\nAdd Complementary Products: If you sell clothing, add accessories. If you sell beauty products, add skincare bundles. This increases average order value without proportionally increasing your operational complexity.\n\nDevelop Strategic Partnerships: Connect with complementary vendors. A food vendor could partner with a beverage vendor. A logistics partner can handle fulfillment while you focus on sales.\n\nInvest in Visibility: At this stage, you can afford basic digital marketing. Start with WhatsApp broadcasts, then move to Instagram marketing. Analytics show that consistent Instagram presence increases sales by 30-50% for most vendors.\n\n## Phase 3: Acceleration (₦600K - ₦1M)\n\nThis phase requires systems and team:\n\nBuild a Team: You can\'t do everything yourself anymore. Hire for your weaknesses. If you\'re not great at customer service, hire someone who is.\n\nLeverage Technology: Use VendorVille\'s inventory management, automated invoicing, and customer analytics. Technology multiplies your efficiency by 10x.\n\nCreate a Brand: Move beyond being a vendor to being a brand customers recognize and trust.'
  },
  {
    id: 2,
    title: 'The Complete Guide to Using VendorVille Analytics to Boost Sales',
    excerpt: 'Unlock the power of data-driven decisions.',
    author: 'Tunde Okoro',
    authorRole: 'Analytics Expert',
    authorBio: 'Tunde has helped 500+ Nigerian vendors use data to improve their bottom line.',
    date: 'July 1, 2026',
    category: 'Tools & Tips',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    readTime: '6 min read',
    content: 'Analytics are the backbone of modern vendor operations. This guide walks you through VendorVille\'s powerful analytics features and how to use them to grow your business.'
  },
  {
    id: 3,
    title: 'Building Trust with Customers: Retention Strategies That Work',
    excerpt: 'Customer retention is 5-25x cheaper than acquisition.',
    author: 'Zainab Mohammed',
    authorRole: 'Customer Success Manager',
    authorBio: 'Zainab leads customer success at VendorVille and has worked with hundreds of vendors.',
    date: 'June 28, 2026',
    category: 'Customer Retention',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: '7 min read',
    content: 'Building trust is the foundation of any successful vendor business. Discover the proven frameworks that turn one-time buyers into lifetime customers.'
  },
  {
    id: 4,
    title: 'Competitive Pricing Without Killing Your Margins',
    excerpt: 'Price wars destroy businesses.',
    author: 'Kunle Obi',
    authorRole: 'Business Strategist',
    authorBio: 'Kunle specializes in pricing strategy and has helped vendors increase margins by 30%.',
    date: 'June 25, 2026',
    category: 'Pricing',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    readTime: '5 min read',
    content: 'Pricing is one of the most critical decisions vendors make. Learn the framework for pricing that balances competitiveness with profitability.'
  },
  {
    id: 5,
    title: 'Seasonal Planning: How to Prepare Your Business for Peak Demand',
    excerpt: 'Peak seasons can make or break your annual revenue.',
    author: 'Ada Nwankwo',
    authorRole: 'Operations Manager',
    authorBio: 'Ada has managed operations for multi-million naira vendor businesses.',
    date: 'June 22, 2026',
    category: 'Operations',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: '9 min read',
    content: 'Seasonal patterns significantly impact vendor businesses. Learn how to prepare, plan, and profit during peak demand seasons.'
  },
  {
    id: 6,
    title: 'Logistics & Delivery Excellence',
    excerpt: 'Fast, reliable delivery is a competitive advantage.',
    author: 'Emeka Eze',
    authorRole: 'Logistics Specialist',
    authorBio: 'Emeka has worked with VendorVille logistics partners.',
    date: 'June 19, 2026',
    category: 'Growth',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    readTime: '6 min read',
    content: 'Logistics excellence separates thriving vendors from struggling ones. Learn how to optimize your delivery operations.'
  },
  {
    id: 7,
    title: 'Digital Marketing on a Shoestring Budget',
    excerpt: 'You don\'t need a huge budget to grow online.',
    author: 'Blessing Okafor',
    authorRole: 'Marketing Director',
    authorBio: 'Blessing leads marketing strategy for VendorVille.',
    date: 'June 16, 2026',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    readTime: '8 min read',
    content: 'Digital marketing doesn\'t require a Fortune 500 budget. This guide shares cost-effective strategies for vendor growth.'
  },
  {
    id: 8,
    title: 'Financial Management for Vendors',
    excerpt: 'Many vendors don\'t know their actual profit.',
    author: 'Olu Adebayo',
    authorRole: 'Accountant & Business Advisor',
    authorBio: 'Olu has helped hundreds of Nigerian vendors transition to formal accounting.',
    date: 'June 13, 2026',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: '7 min read',
    content: 'Proper financial management is the foundation of sustainable vendor growth.'
  }
]

export default function BlogDetailPage() {
  const params = useParams()
  const postId = parseInt(params.id as string)
  const post = mockBlogPosts.find(p => p.id === postId)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!post) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <Link href="/blog">← Back to Blog</Link>
      </div>
    )
  }

  const relatedPosts = mockBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  return (
    <>
       <NavbarMobile />
      <article className="blog-detail">
        <header className="article-header">
          <div className="header-bg" aria-hidden="true"></div>
          <div className="header-overlay" aria-hidden="true"></div>
          <div className="wrap header-content">
            <div className="article-meta">
              <span className="category-tag">{post.category}</span>
              <span className="read-time">{post.readTime}</span>
            </div>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-byline">
              <div className="author-info">
                <div className="author-avatar">{post.author.charAt(0)}</div>
                <div>
                  <div className="author-name">{post.author}</div>
                  <div className="author-role">{post.authorRole}</div>
                </div>
              </div>
              <span className="publish-date">{post.date}</span>
            </div>
          </div>
        </header>

        <div className="article-container">
          <div className="article-main">
            <img src={post.image} alt={post.title} className="featured-image" />
            <div className="article-body">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('##')) {
                  return <h2 key={idx} className="section-title">{paragraph.replace('## ', '')}</h2>
                }
                if (paragraph.startsWith('') && paragraph.endsWith('')) {
                  return <p key={idx} className="bold-intro">{paragraph.replace(/\*\*/g, '')}</p>
                }
                return <p key={idx} className="body-text">{paragraph}</p>
              })}
            </div>

            <div className="author-bio-section">
              <div className="author-bio-card">
                <div className="author-avatar-large">{post.author.charAt(0)}</div>
                <div className="bio-content">
                  <h3>{post.author}</h3>
                  <p className="bio-role">{post.authorRole}</p>
                  <p className="bio-text">{post.authorBio}</p>
                </div>
              </div>
            </div>

            <div className="share-section">
              <span>Share this article:</span>
              <div className="share-buttons">
                <button className="share-btn twitter" title="Share on Twitter">𝕏</button>
                <button className="share-btn whatsapp" title="Share on WhatsApp">WA</button>
                <button className="share-btn linkedin" title="Share on LinkedIn">In</button>
                <button className="share-btn email" title="Share via Email">✉</button>
              </div>
            </div>
          </div>

          <aside className="article-sidebar">
            <div className="sidebar-card">
              <h4>More from {post.category}</h4>
              <div className="related-posts">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map(related => (
                    <Link key={related.id} href={`/blog/${related.id}`} className="related-item">
                      <span className="dot"></span>
                      <div>
                        <div className="related-title">{related.title}</div>
                        <div className="related-date">{related.date}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p style={{ color: '#667085', fontSize: '0.9rem' }}>No related posts yet.</p>
                )}
              </div>
            </div>

            <div className="sidebar-card cta-card">
              <div className="cta-icon">📚</div>
              <h4>Share Your Story</h4>
              <p>Have a vendor success story? Write a guest post and inspire other Nigerian entrepreneurs.</p>
              <button className="cta-btn">Contribute a Post</button>
            </div>
          </aside>
        </div>
      </article>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="mark"></span>VendorVille
            </div>
            <p className="tagline">The all-in-one platform for Nigerian vendors.</p>
            <span className="footer-phone">+234 707 647 3776</span>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <Link href="/blog">Blog</Link>
            <a href="/about">About</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Become a Partner</a>
            <a href="#">Contact</a>
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
          <span>Building Nigeria's vendor economy</span>
        </div>
      </footer>
    </>
  )
}
