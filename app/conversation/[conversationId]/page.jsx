"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import ChatSidebar from "@/components/chat-sidebar";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";
import { getArchivedConversationByConversationId } from "@/lib/api";

export default function ConversationPage() {
  const params = useParams();
  const { data: session } = useSession();
  const conversationId = params.conversationId;
  const [isArchived, setIsArchived] = useState(false);
  const [archiveInfo, setArchiveInfo] = useState(null);

  useEffect(() => {
    const checkIfArchived = async () => {
      if (session && conversationId) {
        try {
          const response = await getArchivedConversationByConversationId(
            conversationId
          );
          if (response.success && response.data) {
            setIsArchived(true);
            setArchiveInfo(response.data);
          } else {
            setIsArchived(false);
            setArchiveInfo(null);
          }
        } catch (error) {
          console.error("Error checking archive status:", error);
          setIsArchived(false);
          setArchiveInfo(null);
        }
      }
    };

    checkIfArchived();
  }, [session, conversationId]);

  const handleNewChat = async () => {
    try {
      const { createConversation } = await import("@/lib/api");
      const response = await createConversation("New Chat");
      if (response.success) {
        window.location.href = `/conversation/${response.data.conversation.id}`;
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
      // Fallback to app page if creation fails
      window.location.href = "/app";
    }
  };

  const handleSelectChat = (conversation) => {
    window.location.href = `/conversation/${conversation.id}`;
  };

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
      <div className="fixed inset-0 bg-background/50 backdrop-blur-md z-10" />

      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        {/* Chat Sidebar - Fixed */}
        <div className="w-80 flex-shrink-0">
          <ChatSidebar
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            currentChatId={conversationId}
          />
        </div>

        {/* Chat Interface - Scrollable */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-white text-lg font-medium">
                  {isArchived && archiveInfo ? archiveInfo.title : "Chat"}
                </h2>
                {isArchived && (
                  <Badge
                    variant="outline"
                    className="text-white border-white/20"
                  >
                    <Archive className="h-3 w-3 mr-1" />
                    Archived
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* <div className="text-white/60 text-sm">
                  Conversation ID: {conversationId}
                </div> */}
              </div>
            </div>
            <p className="text-white/40 text-xs mt-1">
              {isArchived
                ? "This is an archived conversation • Messages are read-only"
                : "RAG system ready • Ask questions about your sources"}
            </p>
          </div>

          <ChatInterface
            sources={[]}
            conversationId={conversationId}
            showHeader={false}
            readOnly={isArchived}
          />
        </div>
      </div>
    </div>
  );
}
