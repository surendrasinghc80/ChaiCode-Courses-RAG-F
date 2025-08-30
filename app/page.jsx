"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "@/components/landing-page";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users based on role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/app");
      }
    }
  }, [status, session, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  // Don't render anything while redirecting
  return null;
}
