"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    setSessionId(searchParams.get("session_id"))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700 text-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adobe%20Express%20-%20file-qT65bQrAcBmtYi4mvrKMI7AE3aXifp.png"
          alt="Nuvex Logo"
          width={120}
          height={60}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-slate-300 mb-6">Thank you for subscribing to Nuvex. Your account is now active.</p>
        <p className="text-slate-400 mb-8">Session ID: {sessionId}</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => (window.location.href = "/")}>
          Return to Homepage
        </Button>
      </div>
    </div>
  )
}

