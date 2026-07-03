'use client'

import { useEffect } from 'react'

export function ClientScripts() {
  useEffect(() => {
    // Nav shadow on scroll
    const nav = document.querySelector('nav')
    const handleNavScroll = () => {
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 10)
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true })

    // Scroll-reveal for sections and grids
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    revealEls.forEach((el) => io.observe(el))

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach((item) => {
      const head = item.querySelector('.faq-head')
      const answer = item.querySelector('.faq-answer') as HTMLElement
      head?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')
        document.querySelectorAll('.faq-item.open').forEach((open) => {
          if (open !== item) {
            open.classList.remove('open')
            const openAnswer = open.querySelector(
              '.faq-answer'
            ) as HTMLElement
            if (openAnswer) openAnswer.style.maxHeight = ''
          }
        })
        item.classList.toggle('open', !isOpen)
        if (answer) {
          answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : ''
        }
      })
    })

    // Pricing toggle (Monthly/Yearly) visual switch
    const toggleSpans = document.querySelectorAll('.toggle-pill span')
    toggleSpans.forEach((span) => {
      span.addEventListener('click', () => {
        toggleSpans.forEach((s) => s.classList.remove('active'))
        span.classList.add('active')
      })
    })

    return () => {
      window.removeEventListener('scroll', handleNavScroll)
      io.disconnect()
    }
  }, [])

  return null
}
