'use client'

import NavbarMobile from '@/components/NavbarMobile'
import api from '@/store/axiosInstance'
import Link from 'next/link'
import { useState } from 'react'
import './track-order.css'

const statusSteps = ['pending', 'paid', 'fulfilled']
const statusLabels: Record<string, string> = { pending: 'Order Received', paid: 'Payment Confirmed', fulfilled: 'Delivered' }

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setIsLoading(true)
    try {
      const res = await api.post('/store/track-order', { orderNumber, phone })
      setOrder(res.data.order)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found')
    } finally {
      setIsLoading(false)
    }
  }

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1

  return (
    <>
      <NavbarMobile />
      <div className="track-page">
        <div className="track-hero">
          <div className="wrap">
            <span className="track-eyebrow">✦ Track Order</span>
            <h1>Where's My Order?</h1>
            <p>Enter your order number and phone to check the status.</p>
          </div>
        </div>

        <div className="wrap track-content">
          {!order ? (
            <form onSubmit={handleTrack} className="track-form">
              <div className="field-group">
                <label className="field-label">Order Number</label>
                <input type="text" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. VH-123456" />
              </div>
              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Used at checkout" />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn-create" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          ) : (
            <div className="track-result">
              <div className="track-result-header">
                <div>
                  <h2>{order.orderNumber}</h2>
                  <Link href={`/store/${order.businessSlug}`}>{order.businessName}</Link>
                </div>
                <button className="btn-secondary-modal" onClick={() => setOrder(null)}>Track Another</button>
              </div>

              {order.status === 'cancelled' ? (
                <div className="track-cancelled">This order was cancelled.</div>
              ) : (
                <div className="track-progress">
                  {statusSteps.map((step, i) => (
                    <div key={step} className={`track-step ${i <= currentStepIndex ? 'complete' : ''}`}>
                      <div className="track-step-dot" />
                      <span>{statusLabels[step]}</span>
                    </div>
                  ))}
                </div>
              )}

              {order.dispatch && (
                <div className="track-dispatch">
                  <strong>Rider:</strong> {order.dispatch.riderName} · {order.dispatch.riderPhone}
                  <div className="track-dispatch-status">Status: {order.dispatch.status.replace('_', ' ')}</div>
                </div>
              )}

              <div className="track-items">
                {order.items.map((item: any) => (
                  <div className="track-item-row" key={item.id}>
                    <span>{item.quantity}× {item.productName}</span>
                    <span>₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="track-total">
                <span>Total</span>
                <span>₦{(order.totalAmount + order.deliveryFee).toLocaleString()}</span>
              </div>

              <div className="track-address">
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}