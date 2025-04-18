import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/client-auth-provider"
import { OfflineAlert } from "@/components/offline-alert"
import { initializeStorage } from "@/lib/storage"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Real Estate Agent Platform",
  description: "Manage and share property collections with clients",
    generator: 'v0.dev'
}

// Initialize storage bucket
initializeStorage().catch(console.error)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientAuthProvider>
            {children}
            <Toaster />
            <OfflineAlert />
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
