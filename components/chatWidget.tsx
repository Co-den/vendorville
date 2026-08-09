// components/ChatWidget.tsx
'use client'

import api from '@/store/axiosInstance'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [thread, setThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    api.get('/auth/chat').then((res) => {
      setThread(res.data.thread)
      setMessages(res.data.messages)
    })

    const token = localStorage.getItem('token')
    const socket = io(process.env.NEXT_PUBLIC_API_URL!.replace('/api', ''), { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
      if (thread) socket.emit('join_thread', thread.id)
    })
    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => { socket.disconnect() }
  }, [isOpen])

  useEffect(() => {
    if (thread && socketRef.current) socketRef.current.emit('join_thread', thread.id)
  }, [thread])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    const res = await api.post('/auth/chat', { message: text })
    setMessages((prev) => [...prev, res.data.message])
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setIsOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span>Support Chat</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-panel-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.senderType === 'vendor' ? 'sent' : 'received'}`}>
                {m.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-panel-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}