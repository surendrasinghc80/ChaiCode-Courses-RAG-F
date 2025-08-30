"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  // Settings,
  // Share,
  LogOut,
  Brain,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { AddSourcesModal } from "@/components/add-sources-modal";
import { ChatInterface } from "@/components/chat-interface";
import ChatSidebar from "@/components/chat-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
// import { StudioPanel } from "@/components/studio-panel";

function NotebookLMContent() {
  const [showAddSources, setShowAddSources] = useState(false);
  const [sources, setSources] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
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

  // Don't render anything if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  const handleLogout = () => {
    signOut();
  };

  const handleAddSources = (newSources) => {
    setSources((prev) => [...prev, ...newSources]);
  };

  const handleDeleteSource = (sourceId) => {
    setSources((prev) => prev.filter((source) => source.id !== sourceId));
  };

  const handleSendMessage = (message) => {
    // Handle message sending logic here
    console.log("Sending message:", message);
  };

  const handleNewChat = () => {
    // Handle new chat creation
    console.log("Creating new chat");
  };

  const handleSelectChat = (conversation) => {
    // Handle chat selection
    console.log("Selected chat:", conversation);
  };

  return (
    <div className="min-h-screen relative w-full">
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
      <div className="fixed inset-0 bg-background/70 backdrop-blur-md z-10" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border/50 backdrop-blur-md bg-background/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="ChaiCode RAG" className="h-8 w-8" />
              <h1 className="text-foreground text-lg font-medium">
                ChaiCode RAG
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email || "No email"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Three-panel layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Chat Sidebar */}
          <ChatSidebar
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            currentChatId={null}
          />

          {/* Chat Panel */}
          <ChatInterface sources={[]} onSendMessage={handleSendMessage} />

          {/* Studio Panel */}
          {/* <StudioPanel sources={sources} /> */}
        </div>
      </div>

      {/* Add Sources Modal */}
      <AddSourcesModal
        isOpen={showAddSources}
        onClose={() => setShowAddSources(false)}
        onAddSources={handleAddSources}
      />
    </div>
  );
}

export default function NotebookLM() {
  return <NotebookLMContent />;
}
