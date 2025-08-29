"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Brain,
  MessageSquare,
  Sparkles,
  Upload,
  Star,
  ArrowRight,
  Play,
  Mic,
  Video,
  Map,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Smart Document Upload",
      description:
        "Upload PDFs, text files, audio, and more. Our AI instantly processes and indexes your content for intelligent retrieval.",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "AI-Powered Chat",
      description:
        "Ask questions about your documents and get precise, contextual answers with source citations and confidence scores.",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Content Generation",
      description:
        "Generate summaries, study guides, mind maps, and audio overviews from your uploaded documents automatically.",
    },
  ];

  const studioFeatures = [
    {
      icon: <Mic className="h-6 w-6 text-primary" />,
      title: "Audio Overview",
      description: "AI-generated podcasts from your documents",
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Video Summaries",
      description: "Visual content breakdowns and explanations",
    },
    {
      icon: <Map className="h-6 w-6 text-primary" />,
      title: "Mind Maps",
      description: "Interactive concept mapping and visualization",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Analytics",
      description: "Insights and patterns from your content",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Scientist",
      content:
        "This RAG application has revolutionized how I analyze research papers. The AI chat feature saves me hours of manual reading.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Graduate Student",
      content:
        "The study guide generation is incredible. It turns my lecture notes into comprehensive study materials automatically.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Professor",
      content:
        "I use this for analyzing student submissions and generating feedback. The source citations are always accurate.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            e.currentTarget.play().catch(console.error);
          }}
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/project-x-e3c38.appspot.com/o/animation-video%2Flanding-page-video.mp4?alt=media&token=3528e1cb-c8a5-4c8b-a37f-97f1e7c87e49"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support the video */}
        </video>
        {/* Enhanced fallback background with animated gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>
      <div className="fixed inset-0 bg-background/70 backdrop-blur-md z-10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src="/icon.svg"
                  alt="Icon"
                  className="h-8 w-8 text-gray-900"
                />
              </div>
              <span className="text-xl font-bold">ChaiCode RAG</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#studio"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Studio
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Document Analysis
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                Unlock Insights from Your Documents with AI
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform any document into an intelligent knowledge base. Chat
                with your content, generate summaries, and create study
                materials with our advanced RAG technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/signup">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Start Analyzing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Demo Preview */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop PDFs, text files, or paste URLs
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Ask Questions</h3>
                      <p className="text-sm text-muted-foreground">
                        Chat naturally with your documents using AI
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Generate Content</h3>
                      <p className="text-sm text-muted-foreground">
                        Create summaries, guides, and audio overviews
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to transform documents into actionable
                insights
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Features */}
        <section id="studio" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Studio Tools</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced content generation and analysis tools powered by AI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studioFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <div className="text-accent">{feature.icon}</div>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Users Say</h2>
              <p className="text-xl text-muted-foreground">
                Trusted by researchers, students, and professionals worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already unlocking insights from
              their documents with AI-powered analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img
                      src="/icon.svg"
                      alt="Icon"
                      className="h-8 w-8 text-gray-900"
                    />
                  </div>
                  <span className="text-xl font-bold">ChaiCode RAG</span>
                </div>
                <p className="text-muted-foreground">
                  AI-powered document analysis and content generation platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="#features"
                      className="hover:text-foreground transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#studio"
                      className="hover:text-foreground transition-colors"
                    >
                      Studio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-foreground transition-colors"
                    >
                      Try Demo
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2025 ChaiCode RAG. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
