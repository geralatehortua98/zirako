"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SplashPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10L100 35V85L60 110L20 85V35L60 10Z" fill="white" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-white tracking-wider">ZIRAKO</h1>

        <Button
          onClick={handleContinue}
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-semibold"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
