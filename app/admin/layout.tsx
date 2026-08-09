"use client";

import { useAdminAuthStore } from "@/store/adminAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isAuthenticated, logout } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin/login");
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
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
      <main className="admin-main">{children}</main>
    </div>
  );
}
