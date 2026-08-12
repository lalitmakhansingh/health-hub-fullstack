"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

declare global {
  interface Window {
    google: any
  }
}

export function GoogleSignInButton() {
  const router = useRouter()
  const { refetch } = useAuth()
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      try {
        await apiFetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ idToken: response.credential }),
        })
        await refetch()
        router.push("/dashboard")
      } catch (err) {
        console.error("Google sign-in failed", err)
      }
    }

    const initGoogle = () => {
      if (!window.google || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 350,
      })
    }

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval)
        initGoogle()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [router, refetch])

  return <div ref={buttonRef} className="flex justify-center" />
}