import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ChatButton } from "@/components/chat-button"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ZIRAKO - Reutiliza con propósito",
    template: "%s | ZIRAKO",
  },
  description:
    "Plataforma digital para la recolección, intercambio, donación y venta de artículos de segunda mano. Promoviendo la economía circular y el consumo responsable.",
  keywords: [
    "economía circular",
    "segunda mano",
    "intercambio",
    "donación",
    "reciclaje",
    "sostenibilidad",
    "reutilización",
    "marketplace",
  ],
  authors: [{ name: "ZIRAKO" }],
  creator: "ZIRAKO",
  publisher: "ZIRAKO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {children}
        <ChatButton />
        <Analytics />
      </body>
    </html>
  )
}
