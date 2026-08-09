"use client";

import { useAdminAuthStore } from "@/store/adminAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isAuthenticated, logout } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin/login");
  }, [pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">VendorVille Admin</div>
        <nav>
          <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
            Overview
          </Link>
          <Link
            href="/admin/pending"
            className={pathname === "/admin/pending" ? "active" : ""}
          >
            Pending Approvals
          </Link>
          <Link
            href="/admin/businesses"
            className={pathname === "/admin/businesses" ? "active" : ""}
          >
            All Businesses
          </Link>
          <Link
            href="/admin/chat"
            className={pathname === "/admin/chat" ? "active" : ""}
          >
            Support Chat
          </Link>
        </nav>
        <button
          className="admin-logout"
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
        >
          Logout
        </button>
      </aside>

      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="admin-main">
        <button
          className="admin-mobile-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {children}
      </main>
    </div>
  );
}
