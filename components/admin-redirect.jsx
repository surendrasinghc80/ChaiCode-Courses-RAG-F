"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (session?.user?.role === "admin") {
      // Redirect admin users to dashboard
      router.push("/dashboard")
    }
  }, [session, status, router])

  return null
}
