"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        window.location.href = result.url || callbackUrl || "/";
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Background image rotation
  const images = useMemo(
    () => [
      "/gradiant-bg-1.jpg",
      "/gradiant-bg-2.jpg",
      "/gradiant-bg-3.jpg",
      "/gradiant-bg-4.jpg",
      "/gradiant-bg-5.jpg",
      "/gradiant-bg-6.jpg",
      "/gradiant-bg-7.jpg",
      "/gradiant-bg-8.jpg",
      "/gradiant-bg-9.jpg",
      "/gradiant-bg-10.jpg",
      "/gradiant-bg-11.jpg",
      "/gradiant-bg-12.jpg",
    ],
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [fading, setFading] = useState(false);
  const ROTATE_MS = 6000;
  const FADE_MS = 1000;
  const fadeTimeoutRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;
      const ni = (currentIndexRef.current + 1) % images.length;
      const preload = new Image();

      const triggerFade = () => {
        if (cancelled) return;
        setNextIndex(ni);
        setFading(true);
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
          if (cancelled) return;
          setCurrentIndex(ni);
          setFading(false);
          cycleTimeoutRef.current = setTimeout(runCycle, ROTATE_MS);
        }, FADE_MS);
      };

      preload.src = images[ni];
      if (preload.decode) {
        preload
          .decode()
          .then(triggerFade)
          .catch(() => {
            preload.onload = triggerFade;
          });
      } else {
        preload.onload = triggerFade;
      }
    };

    cycleTimeoutRef.current = setTimeout(runCycle, ROTATE_MS);

    return () => {
      cancelled = true;
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [images]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          opacity: fading ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${images[nextIndex]})`,
          opacity: fading ? 1 : 0,
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-white hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to NotebookLM
            </Link>
            {/* <ThemeToggle /> */}
          </div>

          <Card className="border-white/20 bg-black/30 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold">
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to your NotebookLM account to continue
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-5">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
