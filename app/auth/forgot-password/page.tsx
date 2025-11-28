"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Password reset request for:", email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-primary rounded-lg p-8">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2 mb-4"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>

          {/* Logo hexagonal */}
          <div className="flex justify-center mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 8L68 24V56L40 72L12 56V24L40 8Z" fill="#4FD1C5" stroke="#4FD1C5" strokeWidth="2" />
              <path d="M40 20L58 30V50L40 60L22 50V30L40 20Z" fill="#2D3748" stroke="#2D3748" strokeWidth="2" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-accent mb-2 text-center">ZIRAKO</h1>
          <p className="text-accent text-sm mb-8 text-center">Recuperar contraseña</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-accent text-sm mb-4">
                  Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                </p>
                <Input
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-900 placeholder:text-gray-500 border-none h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
              >
                Enviar instrucciones
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-accent text-sm hover:underline">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-accent/10 border border-accent rounded-lg p-4">
                <p className="text-accent text-sm text-center">
                  Se han enviado las instrucciones de recuperación a <strong>{email}</strong>. Por favor revisa tu
                  correo electrónico.
                </p>
              </div>

              <Link href="/auth/login">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-accent text-xs text-center">T &C Versión 1.2</div>
        </div>
      </div>
    </div>
  )
}
