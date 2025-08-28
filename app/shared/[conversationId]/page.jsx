"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Lock } from "lucide-react";
import { getConversation } from "@/lib/api";

export default function SharedConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Redirect to login with callback URL
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(
        window.location.pathname
      )}`;
      router.push(loginUrl);
      return;
    }

    loadConversation();
  }, [session, status, conversationId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const response = await getConversation(conversationId);
      if (response.success) {
        setConversation(response.data.conversation);
      } else {
        setError("Conversation not found or you don't have access to it.");
      }
    } catch (err) {
      console.error("Failed to load shared conversation:", err);
      setError("Failed to load conversation. It may be private or deleted.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center max-w-md">
          <Lock className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <Button
            onClick={() => router.push("/app")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
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
        </video>
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
      <div className="fixed inset-0 bg-background/50 backdrop-blur-md z-10" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/app")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to App
              </Button>
              <div>
                <h1 className="text-white text-lg font-medium">
                  Shared Conversation
                </h1>
                {conversation && (
                  <p className="text-white/60 text-sm">{conversation.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-white border-white/20">
                <Share2 className="h-3 w-3 mr-1" />
                Shared
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Copy Link
              </Button>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">
            You're viewing a shared conversation • Messages are read-only
          </p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            sources={[]}
            conversationId={conversationId}
            showHeader={false}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
}
