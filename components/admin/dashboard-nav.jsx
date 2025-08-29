"use client";

import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardNav() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <span>•</span>
            <span>ChaiCode RAG Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Welcome,</span>
            <span className="font-medium">{session?.user?.username}</span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-600/10 text-blue-700 dark:text-blue-400">
              Admin
            </span>
          </div>

          <ThemeToggle />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
