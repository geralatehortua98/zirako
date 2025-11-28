"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("zirako_logged_in")
    if (isLoggedIn === "true") {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      localStorage.setItem("zirako_logged_in", "true")
      localStorage.setItem("zirako_user", JSON.stringify(data.user))
      localStorage.setItem("zirako_user_name", data.user.nombre || "")
      localStorage.setItem("zirako_user_email", data.user.email || "")
      localStorage.setItem("zirako_user_id", String(data.user.id || ""))

      if (rememberMe) {
        localStorage.setItem("zirako_email", email)
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-primary rounded-lg p-8 flex flex-col items-center">
          <Link href="/" className="mb-6 cursor-pointer hover:opacity-80 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 8L68 24V56L40 72L12 56V24L40 8Z" fill="#E8F5E3" stroke="#E8F5E3" strokeWidth="2" />
            </svg>
          </Link>

          <h1 className="text-4xl font-bold text-accent mb-2">ZIRAKO</h1>
          <p className="text-accent text-sm mb-8">Reutiliza con propósito</p>

          {error && (
            <div className="w-full bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 border-none h-12 placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-gray-900 border-none h-12 placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-accent data-[state=checked]:bg-accent"
              />
              <Label htmlFor="remember" className="text-accent text-sm cursor-pointer">
                Recordar datos de usuario
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Link href="/auth/register">
              <Button
                type="button"
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10 h-12 text-base font-semibold bg-transparent"
              >
                Registro
              </Button>
            </Link>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-accent text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

          <Link href="/soporte/ticket" className="mt-6 w-full">
            <Button
              variant="outline"
              className="w-full border-accent/50 text-accent hover:bg-accent/10 h-10 text-sm font-medium bg-transparent flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              ¿Necesitas ayuda? Envía un ticket
            </Button>
          </Link>

          <div className="mt-8 text-accent text-xs">T &C Versión 1.2</div>
        </div>
      </div>
    </div>
  )
}
