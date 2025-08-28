"use client";

import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import ChatSidebar from "@/components/chat-sidebar";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId;

  const handleNewChat = () => {
    window.location.href = "/app";
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
        {/* Chat Sidebar */}
        <ChatSidebar
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          currentChatId={conversationId}
        />

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface sources={[]} conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}
