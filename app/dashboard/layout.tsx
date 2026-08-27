"use client";

import ChatWidget from "@/components/chatWidget";
import { useAuthStore } from "@/store/authStore";
import api from "@/store/axiosInstance";
import { registerPushNotifications } from "@/store/pushNotifications";
import { useStaffAuthStore } from "@/store/staffAuthStore";
import {
  Activity,
  Bell,
  Bolt,
  Box,
  House,
  LayoutGrid,
  LogOut,
  Receipt,
  ShoppingCart,
  StarHalf,
  Users,
  Wallet
} from "lucide-react";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import "./dashboard.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-fraunces",
});

const navItems = [
  { href: "/dashboard", label: "Business", icon: "home" },
  { href: "/dashboard/inventory", label: "Inventory", icon: "box" },
  { href: "/dashboard/orders", label: "Orders", icon: "cart" },
  { href: "/dashboard/customers", label: "Customers", icon: "users" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "trend" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "star" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

const financeItems = [
  { href: "/dashboard/subscribe", label: "Subscribe", icon: "refresh" },
  { href: "/dashboard/wallet", label: "e-Wallet", icon: "receipt" },
  { href: "/dashboard/payout", label: "Payout", icon: "wallet" },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: <LayoutGrid />,
    box: <Box />,
    cart: <ShoppingCart />,
    users: <Users />,
    receipt: <Receipt/>,
    settings: <Bolt />,
    home: <House/>,
    trend: <Activity />,
    star:<StarHalf/>,
    refresh: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
    wallet: <Wallet/>,
  };
  return icons[name] || null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isCheckingAuth, checkAuth, logout } =
    useAuthStore();

  const { staff, logout: staffLogout } = useStaffAuthStore();
  const isStaffSession =
    typeof window !== "undefined" && !!localStorage.getItem("staff_token");
  const staffNavItems = [
    { href: "/dashboard", label: "Overview", icon: "grid" },
    { href: "/dashboard/inventory", label: "Inventory", icon: "box" },
    { href: "/dashboard/orders", label: "Orders", icon: "receipt" },
  ];

  const managerNavItems = [
    ...staffNavItems,
    { href: "/dashboard/customers", label: "Customers", icon: "users" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "trend" },
  ];

  const effectiveNavItems = isStaffSession
    ? staff?.role === "manager"
      ? managerNavItems
      : staffNavItems
    : navItems;

  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      setShowPushPrompt(true);
    }
  }, []);

  const handleEnablePush = async () => {
    const success = await registerPushNotifications();
    setShowPushPrompt(false);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (activeBusinessId) {
      const poll = () => {
        api
          .get(`/businesses/${activeBusinessId}/orders/notifications`)
          .then((res) => setNotifications(res.data.notifications))
          .catch(() => {});
      };
      poll();
      const interval = setInterval(poll, 30000);
      return () => clearInterval(interval);
    }
  }, [activeBusinessId]);

  const handleLogout = async () => {
    if (isStaffSession) {
      staffLogout();
    } else {
      await logout();
    }
    router.push(isStaffSession ? "/staff/login" : "/auth/login");
  };

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div
        className={`dash-shell ${fraunces.variable}`}
        style={{ gridTemplateColumns: "1fr" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const initials = user?.firstName?.[0]?.toUpperCase() || "V";

  return (
    <>
      <ChatWidget />
      {showPushPrompt && (
        <div className="push-prompt-banner">
          <span>Get instant alerts for new orders enable notifications?</span>
          <div>
            <button onClick={handleEnablePush} className="push-prompt-enable">
              Enable
            </button>
            <button
              onClick={() => setShowPushPrompt(false)}
              className="push-prompt-dismiss"
            >
              Not now
            </button>
          </div>
        </div>
      )}
      <div className={`dash-shell ${fraunces.variable}`}>
        <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
          <Link className="dash-brand" href="/">
            <h1>
              Vendor<span>Ville</span>
            </h1>
          </Link>
          <nav className="dash-nav">
            {effectiveNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-link ${pathname === item.href ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ))}

            {!isStaffSession && (
              <>
                <div className="dash-nav-section-label">Finance</div>

                {financeItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`dash-nav-link ${pathname === item.href ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
          <div className="dash-sidebar-footer">
            <button className="dash-logout-btn" onClick={handleLogout}>
              <LogOut />
              SIGN OUT
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <header className="dash-topbar">
            <button
              className="dash-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="22"
                height="22"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div />
            <div className="dash-topbar-right">
              <div className="dash-notification-bell">
                <button onClick={() => setShowNotifications((v) => !v)}>
                  <Bell />
                  {notifications.length > 0 && (
                    <span className="dash-notification-badge">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="dash-notification-dropdown">
                    {notifications.length === 0 ? (
                      <div className="dash-notification-empty">
                        No new orders to confirm.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href="/dashboard/orders"
                          className="dash-notification-item"
                          onClick={() => setShowNotifications(false)}
                        >
                          <div className="dash-notification-title">
                            {n.title}
                          </div>
                          <div className="dash-notification-message">
                            {n.message}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="dash-avatar">{initials}</div>
            </div>
          </header>

          <main className="dash-content">{children}</main>
        </div>
      </div>
    </>
  );
}
