"use client"

import { useEffect, useState } from "react"
import { getUserDetails } from "../../lib/api"

export default function UserDetailsModal({ isOpen, userId, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (!isOpen || !userId) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await getUserDetails(userId)
        if (!cancelled && response.success) {
          setUserData(response.data)
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Error loading user details")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isOpen, userId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="user-details-title">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id="user-details-title" className="text-lg font-semibold">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="space-y-3">
              <div className="h-6 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-24 rounded bg-muted animate-pulse" />
            </div>
          )}
          {error && <div className="text-red-600 dark:text-red-500">{error}</div>}
          {userData && !loading && !error && (
            <div className="space-y-4">
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground">Profile</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <Info label="Username" value={userData.username} />
                  <Info label="Email" value={userData.email} />
                  <Info label="Age" value={userData.age} />
                  <Info label="City" value={userData.city} />
                  <Info label="Role" value={userData.role} />
                  <Info label="Status" value={userData.isActive ? "Active" : "Blocked"} />
                  <Info label="Joined" value={new Date(userData.createdAt).toLocaleString()} />
                  <Info label="Updated" value={new Date(userData.updatedAt).toLocaleString()} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-muted-foreground">Statistics</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <Info label="Total Conversations" value={userData.statistics.totalConversations} />
                  <Info label="Active Conversations" value={userData.statistics.activeConversations} />
                  <Info label="Total Messages" value={userData.statistics.totalMessages} />
                  <Info label="User Messages" value={userData.statistics.userMessages} />
                  <Info label="Remaining Messages" value={userData.statistics.remainingMessages} />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{String(value)}</div>
    </div>
  )
}
