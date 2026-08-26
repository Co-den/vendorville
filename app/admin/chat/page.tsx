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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  const socketRef = useRef<Socket | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * Prevents automatic scrolling when the admin is intentionally
   * reading older messages.
   */
  const shouldAutoScrollRef = useRef(true);

  /*
   * Keeps track of the currently joined thread.
   */
  const joinedThreadRef = useRef<number | null>(null);

  /*
   * Prevent duplicate messages when both:
   *
   * 1. POST /messages returns the message
   * 2. Socket.IO emits new_message
   *
   * with the same message.
   */
  const addMessageIfNotExists = (message: Message) => {
    setMessages((prev) => {
      const exists = prev.some((item) => item.id === message.id);

      if (exists) {
        return prev;
      }

      return [...prev, message];
    });
  };

  /*
   * Scroll to the bottom of the conversation.
   */
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
  };

  /*
   * Check whether the admin is currently close to the bottom.
   *
   * This allows the admin to scroll up and read old messages
   * without being forced back to the bottom whenever a new
   * message arrives.
   */
  const isNearBottom = () => {
    const container = messagesContainerRef.current;

    if (!container) {
      return true;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom < 120;
  };

  /*
   * Handle manual scrolling.
   */
  const handleMessagesScroll = () => {
    shouldAutoScrollRef.current = isNearBottom();
  };

  /*
   * Load all support threads.
   */
  const loadThreads = async () => {
    try {
      const res = await adminApi.get("/admin/chat/threads");

      setThreads(res.data.threads || []);
    } catch (error) {
      console.error("Failed to load chat threads:", error);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  /*
   * Initial setup.
   */
  useEffect(() => {
    loadThreads();

    const token = localStorage.getItem("admin_token");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }

    const socket = io(apiUrl.replace("/api", ""), {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    /*
     * When a thread receives a new message,
     * refresh the thread list so unread counts /
     * latest message information stay updated.
     */
    socket.on("thread_updated", () => {
      loadThreads();
    });

    /*
     * Receive real-time messages.
     */
    socket.on("new_message", (message: Message) => {
      if (!message?.threadId) {
        return;
      }

      /*
       * Only add the message if it belongs to the
       * currently opened conversation.
       */
      if (
        activeThreadRef.current &&
        message.threadId === activeThreadRef.current.id
      ) {
        const wasNearBottom = isNearBottom();

        addMessageIfNotExists(message);

        /*
         * Only auto-scroll if the admin was already
         * near the bottom.
         */
        if (wasNearBottom) {
          shouldAutoScrollRef.current = true;

          requestAnimationFrame(() => {
            scrollToBottom("smooth");
          });
        }
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Chat socket connection error:", error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  /*
   * Ref for the active thread.
   *
   * This prevents the Socket.IO handler from using
   * stale activeThread state.
   */
  const activeThreadRef = useRef<Thread | null>(null);

  useEffect(() => {
    activeThreadRef.current = activeThread;
  }, [activeThread]);

  /*
   * Open a conversation.
   */
  const openThread = async (thread: Thread) => {
    /*
     * Leave previous Socket.IO room.
     */
    if (socketRef.current && joinedThreadRef.current !== null) {
      socketRef.current.emit("leave_thread", joinedThreadRef.current);
    }

    setActiveThread(thread);
    activeThreadRef.current = thread;

    setMessages([]);
    setError("");
    setIsLoadingMessages(true);

    /*
     * Opening a thread should always start at the
     * most recent message.
     */
    shouldAutoScrollRef.current = true;

    try {
      const res = await adminApi.get(
        `/admin/chat/threads/${thread.id}/messages`,
      );

      const loadedMessages: Message[] = res.data.messages || [];

      setMessages(loadedMessages);

      /*
       * Join this thread's Socket.IO room.
       */
      socketRef.current?.emit("join_thread", thread.id);

      joinedThreadRef.current = thread.id;

      /*
       * Clear unread count locally.
       */
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id
            ? {
                ...t,
                unreadCount: 0,
              }
            : t,
        ),
      );

      /*
       * Wait until messages have rendered,
       * then scroll to the latest message.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom("auto");
        });
      });
    } catch (error) {
      console.error("Failed to load messages:", error);

      setError("Failed to load this conversation. Please try again.");

      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  /*
   * Send a message.
   */
  const sendMessage = async () => {
    if (!input.trim() || !activeThread || isSending) {
      return;
    }

    const text = input.trim();

    setInput("");
    setError("");
    setIsSending(true);

    try {
      const res = await adminApi.post(
        `/admin/chat/threads/${activeThread.id}/messages`,
        {
          message: text,
        },
      );

      const newMessage: Message = res.data.message;

      /*
       * Add only if Socket.IO hasn't already
       * delivered the message.
       */
      addMessageIfNotExists(newMessage);

      /*
       * Sending a message should always take the
       * admin to the latest message.
       */
      shouldAutoScrollRef.current = true;

      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });

      /*
       * Refresh thread list so the latest message
       * ordering stays correct.
       */
      loadThreads();
    } catch (error: any) {
      console.error("Failed to send message:", error);

      setInput(text);

      setError(
        error?.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  /*
   * Send with Enter.
   */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="admin-chat-page">
      <h1>Vendor Support Chat</h1>

      <p className="admin-sub">Respond to vendor inquiries in real time.</p>

      <div className="admin-chat-layout">
        {/* =========================
            THREAD LIST
        ========================== */}
        <div className="admin-chat-threads">
          {isLoadingThreads ? (
            <div className="admin-loading">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="admin-empty">No conversations yet.</div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={`admin-thread-item ${
                  activeThread?.id === thread.id ? "active" : ""
                }`}
                onClick={() => openThread(thread)}
              >
                <div className="admin-thread-avatar">
                  {thread.vendorName?.[0]?.toUpperCase() || "V"}
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

        {/* =========================
            CHAT WINDOW
        ========================== */}
        <div className="admin-chat-window">
          {!activeThread ? (
            <div className="admin-chat-empty">
              <div>
                <strong>Select a conversation</strong>

                <p>Select a vendor from the list to start replying.</p>
              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="admin-chat-window-header">
                <div className="admin-thread-avatar">
                  {activeThread.vendorName?.[0]?.toUpperCase() || "V"}
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

              {/* ERROR */}
              {error && <div className="admin-chat-error">{error}</div>}

              {/* MESSAGES */}
              <div
                ref={messagesContainerRef}
                className="admin-chat-messages"
                onScroll={handleMessagesScroll}
              >
                {isLoadingMessages ? (
                  <div className="admin-chat-loading">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="admin-chat-no-messages">No messages yet.</div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderType === "admin";

                    const senderName = isAdmin
                      ? admin?.firstName
                        ? `${admin.firstName} ${admin.lastName || ""}`.trim()
                        : "You"
                      : activeThread.vendorName;

                    return (
                      <div
                        key={m.id}
                        className={`chat-message-wrapper ${
                          isAdmin ? "sent-wrapper" : "received-wrapper"
                        }`}
                      >
                        <div
                          className={`chat-bubble ${
                            isAdmin ? "sent" : "received"
                          }`}
                        >
                          <div className="chat-sender-name">{senderName}</div>

                          <div className="chat-message-text">{m.message}</div>

                          <div className="chat-message-time">
                            {new Date(m.createdAt).toLocaleTimeString("en-NG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Scroll target */}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="chat-panel-input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a reply..."
                  disabled={isSending}
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={isSending || !input.trim()}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
