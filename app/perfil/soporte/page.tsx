"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, MessageCircle, Mail, Phone, HelpCircle, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  type: "user" | "support"
  content: string
  timestamp: Date
}

export default function SoportePage() {
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "support",
      content: "¡Hola! Bienvenido al soporte de ZIRAKO. ¿En qué podemos ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [showEmailPrompt, setShowEmailPrompt] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const nombre = localStorage.getItem("zirako_user_name")
    const email = localStorage.getItem("zirako_user_email")
    if (nombre && email) {
      setUserName(nombre)
      setUserEmail(email)
    }
  }, [])

  const handleStartChat = () => {
    if (!userEmail || !userName) return
    setShowEmailPrompt(false)
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "support",
        content: `Gracias ${userName}. Tu mensaje será enviado a nuestro equipo y te responderemos al correo ${userEmail}. ¿Cuál es tu consulta?`,
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()

    setNewMessage("")

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)

    try {
      await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          message: messageContent,
        }),
      })

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "support",
            content:
              "Tu mensaje ha sido enviado a nuestro equipo de soporte. Te responderemos a tu correo electrónico lo antes posible. ¿Hay algo más en lo que podamos ayudarte?",
            timestamp: new Date(),
          },
        ])
        setIsSending(false)
      }, 1000)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "support",
          content:
            "Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo o envía un correo directamente a soporte@zirako.co",
          timestamp: new Date(),
        },
      ])
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/perfil">
            <Button
              variant="outline"
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 h-10 px-4 flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Regresar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Soporte Técnico</h1>
        </div>

        {/* Opciones de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card
            className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 cursor-pointer"
            onClick={() => setShowChat(true)}
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full p-3">
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-foreground">Chat en vivo</h3>
                <p className="text-sm text-primary-foreground/70">Respuesta inmediata</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full p-3">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-foreground">Email</h3>
                <p className="text-sm text-primary-foreground/70">soporte@zirako.co</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full p-3">
                <Phone className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-foreground">Teléfono</h3>
                <p className="text-sm text-primary-foreground/70">+57 300 123 4567</p>
              </div>
            </div>
          </Card>

          <Link href="/soporte/ticket">
            <Card className="bg-secondary border-secondary hover:bg-secondary/90 transition-colors p-6 h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <HelpCircle className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-foreground">Crear Ticket</h3>
                  <p className="text-sm text-primary-foreground/70">Soporte detallado</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Preguntas frecuentes */}
        <Card className="bg-secondary border-secondary p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <div className="border-b border-primary pb-4">
              <h3 className="font-semibold text-primary-foreground mb-2">¿Cómo funciona el sistema de puntos?</h3>
              <p className="text-sm text-primary-foreground/70">
                Ganas puntos por cada intercambio, donación o venta que realices en la plataforma.
              </p>
            </div>
            <div className="border-b border-primary pb-4">
              <h3 className="font-semibold text-primary-foreground mb-2">¿Cómo programo una recolección?</h3>
              <p className="text-sm text-primary-foreground/70">
                Ve a la sección de Recolección, completa el formulario con tu dirección y horario disponible.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground mb-2">¿Puedo cancelar un intercambio?</h3>
              <p className="text-sm text-primary-foreground/70">
                Sí, puedes cancelar un intercambio antes de que sea confirmado por ambas partes.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-gray-200 bg-primary">
            <DialogTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="h-5 w-5" />
              Chat ZIRAKO
            </DialogTitle>
            <p className="text-white/80 text-sm">Estamos aquí para ayudarte</p>
          </DialogHeader>

          {showEmailPrompt ? (
            <div className="flex-1 p-4 space-y-4">
              <p className="text-gray-600 text-sm">
                Para iniciar el chat, necesitamos tu información de contacto. Te responderemos por correo electrónico.
              </p>
              <div className="space-y-2">
                <Label className="text-gray-700">Nombre</Label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Correo electrónico</Label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleStartChat}
                disabled={!userName || !userEmail}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Iniciar Chat
              </Button>
            </div>
          ) : (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === "user" ? "bg-primary text-white" : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.type === "user" ? "text-white/70" : "text-gray-500"}`}>
                        {msg.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
