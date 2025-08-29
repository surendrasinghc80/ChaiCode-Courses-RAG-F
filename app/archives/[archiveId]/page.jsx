"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Archive,
  Calendar,
  MessageSquare,
  Tag,
  Edit,
} from "lucide-react";
import { getArchivedConversation } from "@/lib/api";

export default function ArchivedConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const archiveId = params.archiveId;
  const [archive, setArchive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    loadArchivedConversation();
  }, [session, status, archiveId]);

  const loadArchivedConversation = async () => {
    try {
      setLoading(true);
      const response = await getArchivedConversation(archiveId);
      if (response.success) {
        setArchive(response.data.archive);
        setMessages(response.data.messages || []);
      } else {
        setError(
          "Archived conversation not found or you don't have access to it."
        );
      }
    } catch (err) {
      console.error("Failed to load archived conversation:", err);
      setError(
        "Failed to load archived conversation. It may be deleted or inaccessible."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading archived conversation...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center max-w-md">
          <Archive className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Archive Not Found</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <Button
            onClick={() => router.push("/archives")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Archives
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
                onClick={() => router.push("/archives")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Archives
              </Button>
              <div>
                <h1 className="text-white text-lg font-medium flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  {archive?.title}
                </h1>
                {archive?.description && (
                  <p className="text-white/60 text-sm">{archive.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-white border-white/20">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log("Edit archive");
                }}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Archive Info */}
          {archive && (
            <div className="mt-3 flex items-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Archived on {formatDate(archive.archivedAt)}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {archive.messageCount} messages
              </div>
              {archive.lastAccessedAt && (
                <div className="flex items-center gap-1">
                  Last viewed {formatDate(archive.lastAccessedAt)}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {archive?.tags && archive.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {archive.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-white/20 text-white"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-white/40 text-xs mt-3">
            This is an archived conversation • Messages are read-only
          </p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            sources={[]}
            conversationId={archive?.conversationId}
            showHeader={false}
            readOnly={true}
            initialMessages={messages}
          />
        </div>
      </div>
    </div>
  );
}
