"use client";

import { adminApi, useAdminAuthStore } from "@/store/adminAuthStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Thread {
  id: number;
  userId: number;
  vendorName: string;
  vendorEmail: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: number;
  threadId: number;
  senderType: "vendor" | "admin";
  senderId: number;
  message: string;
  createdAt: string;
}

export default function AdminChatPage() {
  const { admin } = useAdminAuthStore();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadThreads = () => {
    adminApi
      .get("/admin/chat/threads")
      .then((res) => {
        setThreads(res.data.threads);
        setIsLoadingThreads(false);
      })
      .catch(() => setIsLoadingThreads(false));
  };

  useEffect(() => {
    loadThreads();

    const token = localStorage.getItem("admin_token");
    const socket = io(process.env.NEXT_PUBLIC_API_URL!.replace("/api", ""), {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("thread_updated", () => {
      loadThreads();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const openThread = async (thread: Thread) => {
    setActiveThread(thread);
    const res = await adminApi.get(`/admin/chat/threads/${thread.id}/messages`);
    setMessages(res.data.messages);
    socketRef.current?.emit("join_thread", thread.id);

    // Clear unread badge locally
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t)),
    );
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (msg: Message) => {
      if (activeThread && msg.threadId === activeThread.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socketRef.current.on("new_message", handler);
    return () => {
      socketRef.current?.off("new_message", handler);
    };
  }, [activeThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeThread) return;
    const text = input;
    setInput("");
    const res = await adminApi.post(
      `/admin/chat/threads/${activeThread.id}/messages`,
      { message: text },
    );
    setMessages((prev) => [...prev, res.data.message]);
  };

  return (
    <div className="admin-chat-page">
      <h1>Vendor Support Chat</h1>
      <p className="admin-sub">Respond to vendor inquiries in real time.</p>

      <div className="admin-chat-layout">
        <div className="admin-chat-threads">
          {isLoadingThreads ? (
            <div className="admin-loading">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="admin-empty">No conversations yet.</div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                className={`admin-thread-item ${activeThread?.id === thread.id ? "active" : ""}`}
                onClick={() => openThread(thread)}
              >
                <div className="admin-thread-avatar">
                  {thread.vendorName?.[0] || "V"}
                </div>
                <div className="admin-thread-info">
                  <div className="admin-thread-name">{thread.vendorName}</div>
                  <div className="admin-thread-email">{thread.vendorEmail}</div>
                </div>
                {thread.unreadCount > 0 && (
                  <span className="admin-thread-badge">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="admin-chat-window">
          {!activeThread ? (
            <div className="admin-chat-empty">
              Select a conversation to start replying.
            </div>
          ) : (
            <>
              <div className="admin-chat-window-header">
                <div className="admin-thread-avatar">
                  {activeThread.vendorName?.[0] || "V"}
                </div>
                <div>
                  <div className="admin-thread-name">
                    {activeThread.vendorName}
                  </div>
                  <div className="admin-thread-email">
                    {activeThread.vendorEmail}
                  </div>
                </div>
              </div>

              <div className="admin-chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${m.senderType === "admin" ? "sent" : "received"}`}
                  >
                    {m.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-panel-input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a reply..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
