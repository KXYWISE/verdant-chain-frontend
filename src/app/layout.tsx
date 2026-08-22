import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeScript } from "@/components/theme/theme-script"
import { SiteHeader } from "@/components/site-header/site-header"
import { WalletProvider } from "@/components/wallet/wallet-provider"
import "@/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "VerdAnt",
    template: "%s · VerdAnt",
  },
  description: "Open agricultural technology and financial infrastructure built on Stellar.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faf4" },
    { media: "(prefers-color-scheme: dark)", color: "#101410" },
  ],
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/account", label: "Account" },
]

export default function RootLayout({ children }: { children: import("react").ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <WalletProvider>
          <SiteHeader />
          <nav className="mt-4 flex flex-col sm:flex-row gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 rounded text-sm hover:bg-muted/30"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
