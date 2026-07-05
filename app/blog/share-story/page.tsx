'use client'

import NavbarMobile from "@/components/NavbarMobile";
import Link from 'next/link';
import { useState } from 'react';
import '../share-story.css';

const categories = [
  'Growth',
  'Tools & Tips',
  'Customer Retention',
  'Pricing',
  'Operations',
  'Marketing',
  'Finance',
  'Other'
]

export default function ShareStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Growth',
    excerpt: '',
    content: '',
    authorName: '',
    authorRole: '',
    authorBio: '',
    imageUrl: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Article title is required'
    }
    if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Summary/excerpt is required'
    }
    if (formData.excerpt.trim().length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Article content is required'
    }
    if (formData.content.trim().length < 200) {
      newErrors.content = 'Content must be at least 200 characters'
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Your name is required'
    }

    if (!formData.authorRole.trim()) {
      newErrors.authorRole = 'Your role/title is required'
    }

    if (!formData.authorBio.trim()) {
      newErrors.authorBio = 'Author bio is required'
    }
    if (formData.authorBio.trim().length < 20) {
      newErrors.authorBio = 'Bio must be at least 20 characters'
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Featured image URL is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Submit form data
    console.log('[v0] Submitting story:', formData)
    setSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        title: '',
        category: 'Growth',
        excerpt: '',
        content: '',
        authorName: '',
        authorRole: '',
        authorBio: '',
        imageUrl: ''
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <>
      <NavbarMobile />
      <section className="story-hero">
        <div className="hero-bg" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="wrap hero-content">
          <h1 className="hero-title">Share Your Story</h1>
          <p className="hero-subtitle">Inspire other Nigerian vendors with your success story, challenges overcome, and lessons learned. Help build a thriving vendor community.</p>
        </div>
      </section>

      <section className="story-form-section">
        <div className="wrap">
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Thank You for Your Submission!</h2>
              <p>Your story has been received. Our editorial team will review it and get back to you within 3-5 business days. If approved, your article will be featured on VendorHub Blog to inspire thousands of vendors.</p>
              <Link href="/blog" className="back-btn">← Back to Blog</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="story-form">
              <div className="form-section">
                <h2>Article Details</h2>

                <div className="form-group">
                  <label htmlFor="title">Article Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., How I Scaled My Laundry Business to ₦5M Monthly Revenue"
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="imageUrl">Featured Image URL *</label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={errors.imageUrl ? 'error' : ''}
                    />
                    {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="excerpt">Summary/Excerpt *</label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary of your article (will appear on blog listing)"
                    rows={3}
                    className={errors.excerpt ? 'error' : ''}
                  />
                  {errors.excerpt && <span className="error-text">{errors.excerpt}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="content">Full Article Content *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your complete article here. You can use markdown formatting. Minimum 200 characters."
                    rows={12}
                    className={errors.content ? 'error' : ''}
                  />
                  {errors.content && <span className="error-text">{errors.content}</span>}
                  <div className="char-count">{formData.content.length} characters</div>
                </div>
              </div>

              <div className="form-section">
                <h2>About You</h2>

                <div className="form-group">
                  <label htmlFor="authorName">Your Full Name *</label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="e.g., Chioma Adeyemi"
                    className={errors.authorName ? 'error' : ''}
                  />
                  {errors.authorName && <span className="error-text">{errors.authorName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="authorRole">Your Role/Title *</label>
                  <input
                    type="text"
                    id="authorRole"
                    name="authorRole"
                    value={formData.authorRole}
                    onChange={handleChange}
                    placeholder="e.g., Laundry Business Owner, 5+ years experience"
                    className={errors.authorRole ? 'error' : ''}
                  />
                  {errors.authorRole && <span className="error-text">{errors.authorRole}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="authorBio">Author Bio *</label>
                  <textarea
                    id="authorBio"
                    name="authorBio"
                    value={formData.authorBio}
                    onChange={handleChange}
                    placeholder="Tell readers about yourself. What's your background? What have you achieved? (50-150 characters)"
                    rows={4}
                    className={errors.authorBio ? 'error' : ''}
                  />
                  {errors.authorBio && <span className="error-text">{errors.authorBio}</span>}
                </div>
              </div>

              <div className="form-info">
                <h3>Publishing Guidelines</h3>
                <ul>
                  <li>Articles should be original and authentic to your experience</li>
                  <li>No self-promotion or excessive brand mentions</li>
                  <li>Minimum 200 characters, recommended 500+ words</li>
                  <li>Our editorial team reviews all submissions (3-5 business days)</li>
                  <li>We reserve the right to edit for clarity and grammar</li>
                  <li>Approved articles appear on VendorHub Blog with author credit</li>
                </ul>
              </div>

              <div className="form-actions">
                <Link href="/blog" className="cancel-btn">Cancel</Link>
                <button type="submit" className="submit-btn">Submit Your Story</button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="mark"></span>VendorHub
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
          <span>© 2026 VendorHub Nigeria. All rights reserved.</span>
          <span>Building Nigeria's vendor economy</span>
        </div>
      </footer>
    </>
  )
}
