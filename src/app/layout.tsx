import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeScript } from "@/components/theme/theme-script"
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
