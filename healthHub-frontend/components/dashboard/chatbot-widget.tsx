"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Stethoscope,
  Clock3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

type Doctor = {
  name: string
  specialty: string
  slots: string[]
}

type Message = {
  role: "user" | "assistant"
  content: string
  doctors?: Doctor[]
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help with questions about your appointments, medicines, or how to use HealthHub. I can't diagnose conditions — for anything medical, please consult your doctor.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatPanelRef = useRef<HTMLDivElement>(null)

  const renderDoctorCards = (doctors: Doctor[]) => {
    return (
      <div className="mt-3 space-y-2">
        {doctors.map((doctor) => (
          <div
            key={doctor.name}
            className="rounded-xl border border-border bg-card p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {doctor.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {doctor.specialty}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <Clock3 className="mt-1 h-4 w-4 shrink-0 text-primary" />

              <div className="flex flex-wrap gap-1.5">
                {doctor.slots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-full border border-border bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      if (chatPanelRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return

    setInput(question)
  }

  //   const renderAssistantMessage = (content: string) => {
  //   const doctorRegex =
  //     /\*\*(Dr\.[^*]+)\*\*\s*\(([^)]+)\):\s*([^*]+?)(?=\s+\*\*Dr\.|$)/g

  //   const doctors = [...content.matchAll(doctorRegex)]

  //   // Normal AI response
  //   if (doctors.length === 0) {
  //     return (
  //       <p className="whitespace-pre-wrap leading-6">
  //         {content}
  //       </p>
  //     )
  //   }

  //   const intro = content.slice(0, doctors[0].index).trim()

  //   return (
  //     <div className="space-y-3">
  //       {intro && (
  //         <p className="text-sm leading-6 text-foreground">
  //           {intro}
  //         </p>
  //       )}

  //       <div className="space-y-2">
  //         {doctors.map((match, index) => {
  //           const doctorName = match[1].trim()
  //           const specialty = match[2].trim()
  //           const slots = match[3]
  //             .split(",")
  //             .map((slot) => slot.trim())
  //             .filter(Boolean)

  //           return (
  //             <div
  //               key={`${doctorName}-${index}`}
  //               className="rounded-xl border border-border bg-background p-3 shadow-sm"
  //             >
  //               <div className="flex items-start gap-3">
  //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
  //                   <Stethoscope className="h-4 w-4" />
  //                 </div>

  //                 <div className="min-w-0 flex-1">
  //                   <p className="font-semibold text-foreground">
  //                     {doctorName}
  //                   </p>

  //                   <p className="mt-0.5 text-xs text-muted-foreground">
  //                     {specialty}
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="mt-3 flex items-start gap-2">
  //                 <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

  //                 <div className="flex flex-wrap gap-1.5">
  //                   {slots.map((slot) => (
  //                     <span
  //                       key={slot}
  //                       className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
  //                     >
  //                       {slot}
  //                     </span>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   )
  // }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const { reply,doctors } = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: trimmed }),
      })
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          doctors: doctors?.length ? doctors : undefined,
        },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-border bg-primary/5 rounded-t-xl">
            <h3 className="font-semibold text-foreground">HealthHub Assistant</h3>
            <p className="text-xs text-muted-foreground mt-1">
              General guidance only — not a substitute for medical advice.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "max-w-[80%] bg-primary text-primary-foreground"
                      : "max-w-[92%] bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <>
                      <p className="whitespace-pre-wrap leading-5">
                        {msg.content}
                      </p>

                      {msg.doctors && msg.doctors.length > 0 && (
                        renderDoctorCards(msg.doctors)
                      )}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pb-2">
                <p className="text-xs text-muted-foreground">
                  Try asking:
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "What's my next appointment?",
                    "What medicines am I tracking?",
                    "Give me a summary of my dashboard",
                    "Which doctors are available and at what times?",
                  ].map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your appointments, medicines..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}