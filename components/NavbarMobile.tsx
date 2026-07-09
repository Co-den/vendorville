'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import './navbar-mobile.css'

export default function NavbarMobile() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar-mobile">
      <div className="wrap">
        <Link href="/" className="brand" onClick={closeMenu}>
          <Image
            src="/images/vhub.png"
            alt="VendorHub"
            width={180}
            height={55}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/#testimonials" className="nav-link">Testimonials</Link>
          <Link href="/#pricing" className="nav-link">Pricing</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/#faq" className="nav-link">FAQ</Link>
        </div>

        <button 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Menu */}
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link href="/" className="navbar-link" onClick={closeMenu}>Home</Link>
            <Link href="/about" className="navbar-link" onClick={closeMenu}>About</Link>
            <Link href="/#features" className="navbar-link" onClick={closeMenu}>Features</Link>
            <Link href="/#testimonials" className="navbar-link" onClick={closeMenu}>Testimonials</Link>
            <Link href="/#pricing" className="navbar-link" onClick={closeMenu}>Pricing</Link>
            <Link href="/blog" className="navbar-link" onClick={closeMenu}>Blog</Link>
            <Link href="/#faq" className="navbar-link" onClick={closeMenu}>FAQ</Link>
          </div>

          <div className="navbar-actions">
            <Link className="nav-login" href="/auth/login" onClick={closeMenu}>
              Login
            </Link>
            <Link className="nav-cta" href="/auth/signup" onClick={closeMenu}>
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="nav-right">
          <Link className="nav-login" href="/auth/login">
            Login
          </Link>
          <Link className="nav-cta" href="/auth/signup">
            Create Free Account
          </Link>
        </div>
      </div>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}
