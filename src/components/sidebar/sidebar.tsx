"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./sidebar.module.css"

const STORAGE_KEY = "verdant.sidebar.collapsed"
const ACCOUNT_STORAGE_KEY = "verdant.sidebar.accountOpen"

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={open ? styles.chevronOpen : styles.chevron}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
    </svg>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [accountOpen, setAccountOpen] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage on mount
    setHydrated(true)
    const c = localStorage.getItem(STORAGE_KEY)
    if (c !== null) setCollapsed(c === "true")
    const a = localStorage.getItem(ACCOUNT_STORAGE_KEY)
    if (a !== null) setAccountOpen(a === "true")
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ACCOUNT_STORAGE_KEY, String(accountOpen))
  }, [accountOpen, hydrated])

  // auto-expand Account when on profile/settings/account routes
  useEffect(() => {
    if (
      pathname &&
      (pathname.startsWith("/profile") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/account"))
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- expand based on route
      setAccountOpen(true)
    }
  }, [pathname])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Sidebar"
    >
      <div className={styles.top}>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={styles.collapseBtn}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
        {!collapsed && <span className={styles.brand}>Navigate</span>}
      </div>

      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.item} ${isActive("/") ? styles.active : ""}`}
          title="Home"
        >
          <span className={styles.icon}>
            <HomeIcon />
          </span>
          {!collapsed && <span className={styles.label}>Home</span>}
        </Link>

        <Link
          href="/discover"
          className={`${styles.item} ${isActive("/discover") ? styles.active : ""}`}
          title="Discover"
        >
          <span className={styles.icon}>
            <SearchIcon />
          </span>
          {!collapsed && <span className={styles.label}>Discover</span>}
        </Link>

        <div className={styles.group}>
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setCollapsed(false)
                setAccountOpen(true)
              } else {
                setAccountOpen((v) => !v)
              }
            }}
            className={`${styles.item} ${styles.accountBtn} ${isActive("/account") || isActive("/profile") || isActive("/settings") ? styles.active : ""}`}
            aria-expanded={collapsed ? undefined : accountOpen}
            title="Account"
          >
            <span className={styles.icon}>
              <UserIcon />
            </span>
            {!collapsed && (
              <>
                <span className={styles.label}>Account</span>
                <span className={styles.chevronWrap}>
                  <Chevron open={accountOpen} />
                </span>
              </>
            )}
          </button>

          {!collapsed && accountOpen && (
            <div className={styles.sub}>
              <Link
                href="/account"
                className={`${styles.subItem} ${isActive("/account") && pathname === "/account" ? styles.active : ""}`}
              >
                Overview
              </Link>
              <Link
                href="/profile"
                className={`${styles.subItem} ${isActive("/profile") ? styles.active : ""}`}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className={`${styles.subItem} ${isActive("/settings") ? styles.active : ""}`}
              >
                Settings
              </Link>
            </div>
          )}
        </div>
      </nav>

      {collapsed && (
        <div className={styles.collapsedSub}>
          <Link
            href="/account"
            className={styles.collapsedDot}
            title="Account overview"
            aria-label="Account overview"
          >
            •
          </Link>
          <Link
            href="/profile"
            className={styles.collapsedDot}
            title="Profile"
            aria-label="Profile"
          >
            •
          </Link>
          <Link
            href="/settings"
            className={styles.collapsedDot}
            title="Settings"
            aria-label="Settings"
          >
            •
          </Link>
        </div>
      )}
    </aside>
  )
}
