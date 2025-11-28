"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 border-2 border-accent"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6 text-accent" /> : <MessageCircle className="h-6 w-6 text-accent" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 bg-white border-2 border-accent shadow-xl z-50 flex flex-col">
          <div className="bg-accent p-4 rounded-t-lg">
            <h3 className="font-bold text-accent-foreground">Chat ZIRAKO</h3>
            <p className="text-xs text-accent-foreground/80">Estamos aquí para ayudarte</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-700">Hola, soy el asistente de ZIRAKO. ¿En qué puedo ayudarte hoy?</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    setMessage("")
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (message.trim()) {
                    setMessage("")
                  }
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Enviar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
