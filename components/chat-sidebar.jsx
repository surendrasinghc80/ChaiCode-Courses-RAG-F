"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Plus,
  Search,
  Library,
  User,
  Bot,
  Settings,
  Crown,
  Sparkles,
  MoreHorizontal,
  Share,
  Edit,
  Archive,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} from "@/lib/api";

const ChatSidebar = ({ onNewChat, onSelectChat, currentChatId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load conversations from API
  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllConversations({ page: 1, limit: 50 });

      if (response.success) {
        const formattedConversations = response.data.conversations.map(
          (conv) => ({
            id: conv.id,
            title: conv.title,
            lastMessage: conv.lastMessage?.message || "No messages yet",
            timestamp: formatTimestamp(conv.lastMessageAt),
            messageCount: conv.messageCount,
            isActive: conv.isActive,
            createdAt: conv.createdAt,
            lastMessageAt: conv.lastMessageAt,
          })
        );

        setConversations(formattedConversations);
        setFilteredConversations(formattedConversations);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await createConversation("New Chat");
      if (response.success) {
        await loadConversations(); // Refresh the list
        onNewChat?.(response.data.conversation);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
      setError(err.message);
    }
  };

  const handleMenuAction = async (action, conversation, e) => {
    e.stopPropagation(); // Prevent conversation selection
    console.log(`${action} conversation:`, conversation);

    switch (action) {
      case "share":
        console.log("Share functionality not yet implemented");
        break;
      case "rename":
        const newTitle = prompt("Enter new title:", conversation.title);
        if (newTitle && newTitle.trim() !== conversation.title) {
          try {
            const response = await updateConversation(
              conversation.id,
              newTitle.trim()
            );
            if (response.success) {
              await loadConversations(); // Refresh the list
            }
          } catch (err) {
            console.error("Failed to rename conversation:", err);
            setError(err.message);
          }
        }
        break;
      case "archive":
        console.log("Archive functionality not yet implemented");
        break;
      case "delete":
        if (
          confirm(`Are you sure you want to delete "${conversation.title}"?`)
        ) {
          try {
            const response = await deleteConversation(conversation.id);
            if (response.success) {
              await loadConversations(); // Refresh the list
            }
          } catch (err) {
            console.error("Failed to delete conversation:", err);
            setError(err.message);
          }
        }
        break;
      default:
        break;
    }
  };

  const navigationItems = [
    { icon: Plus, label: "New chat", onClick: handleNewChat },
    { icon: Search, label: "Search chats", onClick: () => {} },
    { icon: Library, label: "Library", onClick: () => {} },
  ];

  const bottomItems = [
    { icon: User, label: "Sora", onClick: () => {} },
    { icon: Crown, label: "GPTs", onClick: () => {} },
  ];

  return (
    <div className="w-80 bg-black/20 backdrop-blur-sm text-white flex flex-col h-full border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-sm bg-white flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-gray-900" />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-b border-white/10">
        <div className="space-y-2">
          {bottomItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Chats</h3>
        </div>

        <ScrollArea className="flex-1 px-2 [&>div>div]:!block">
          <div className="space-y-1 pb-4 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-white/60 text-sm">
                  Loading conversations...
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-4">
                <div className="text-red-400 text-sm text-center">
                  <div>Failed to load conversations</div>
                  <button
                    onClick={loadConversations}
                    className="mt-2 text-xs underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && filteredConversations.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-white/60 text-sm text-center">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredConversation(conversation.id)}
                  onMouseLeave={() => {
                    if (openDropdown !== conversation.id) {
                      setHoveredConversation(null);
                    }
                  }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left p-3 h-auto hover:bg-gray-800",
                      currentChatId === conversation.id ? "bg-gray-800" : ""
                    )}
                    onClick={() => onSelectChat?.(conversation)}
                  >
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="text-sm font-medium text-white truncate mb-1">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {conversation.lastMessage}
                      </div>
                    </div>
                  </Button>

                  {/* Three-dot menu */}
                  {hoveredConversation === conversation.id && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <DropdownMenu
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenDropdown(conversation.id);
                          } else {
                            setOpenDropdown(null);
                            setHoveredConversation(null);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-gray-800 border-gray-600"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleMenuAction("share", conversation, e)
                            }
                            className="text-white hover:bg-gray-700 cursor-pointer"
                          >
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleMenuAction("rename", conversation, e)
                            }
                            className="text-white hover:bg-gray-700 cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleMenuAction("archive", conversation, e)
                            }
                            className="text-white hover:bg-gray-700 cursor-pointer"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleMenuAction("delete", conversation, e)
                            }
                            className="text-red-400 hover:bg-gray-700 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              SS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white">Surendra singh</div>
            <div className="text-xs text-gray-400">Free</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
