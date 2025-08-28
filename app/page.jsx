"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "@/components/landing-page";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to the app
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/app");
    }
  }, [status, router]);

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
