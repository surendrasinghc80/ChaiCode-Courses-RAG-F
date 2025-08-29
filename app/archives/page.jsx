"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Archive,
  Search,
  Calendar,
  MessageSquare,
  Tag,
  Eye,
  Trash2,
  Edit,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllArchives,
  deleteArchivedConversation,
  unarchiveConversation,
} from "@/lib/api";

export default function ArchivesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [hoveredArchive, setHoveredArchive] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    loadArchives();
  }, [session, status]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArchives(archives);
    } else {
      const filtered = archives.filter(
        (archive) =>
          archive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          archive.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          archive.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredArchives(filtered);
    }
  }, [searchQuery, archives]);

  const loadArchives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllArchives({ page: 1, limit: 50 });

      if (response.success) {
        setArchives(response.data.archives);
        setFilteredArchives(response.data.archives);
      }
    } catch (err) {
      console.error("Failed to load archives:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveAction = async (action, archive, e) => {
    e.stopPropagation();

    switch (action) {
      case "view":
        router.push(`/conversation/${archive.conversationId}`);
        break;
      case "edit":
        // TODO: Implement edit modal
        console.log("Edit archive:", archive);
        break;
      case "unarchive":
        if (confirm(`Are you sure you want to unarchive "${archive.title}"?`)) {
          try {
            const response = await unarchiveConversation(archive.id);
            if (response.success) {
              await loadArchives();
            }
          } catch (err) {
            console.error("Failed to unarchive:", err);
            setError(err.message);
          }
        }
        break;
      case "delete":
        if (
          confirm(
            `Are you sure you want to delete the archived conversation "${archive.title}"?`
          )
        ) {
          try {
            const response = await deleteArchivedConversation(archive.id);
            if (response.success) {
              await loadArchives();
            }
          } catch (err) {
            console.error("Failed to delete archive:", err);
            setError(err.message);
          }
        }
        break;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading archives...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
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
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
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
                <h1 className="text-white text-2xl font-bold flex items-center gap-2">
                  <Archive className="h-6 w-6" />
                  Archives
                </h1>
                <p className="text-white/60 text-sm">
                  Your saved conversations for future reference
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-white border-white/20">
              {archives.length} archived
            </Badge>
          </div>

          {/* Search */}
          <div className="mt-4 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <div className="text-red-400 text-sm">
                <div>Failed to load archives</div>
                <button
                  onClick={loadArchives}
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {filteredArchives.length === 0 && !loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Archive className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-xl mb-2">
                  {searchQuery ? "No archives found" : "No archives yet"}
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Archive important conversations to save them for future reference"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/app")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Chatting
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchives.map((archive) => (
                <Card
                  key={archive.id}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer relative group"
                  onClick={() => router.push(`/archives/${archive.id}`)}
                  onMouseEnter={() => setHoveredArchive(archive.id)}
                  onMouseLeave={() => {
                    if (openDropdown !== archive.id) {
                      setHoveredArchive(null);
                    }
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-white truncate pr-8">
                        {archive.title}
                      </h3>

                      {/* Three-dot menu */}
                      {hoveredArchive === archive.id && (
                        <div className="absolute top-4 right-4">
                          <DropdownMenu
                            onOpenChange={(open) => {
                              if (open) {
                                setOpenDropdown(archive.id);
                              } else {
                                setOpenDropdown(null);
                                setHoveredArchive(null);
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
                                  handleArchiveAction("view", archive, e)
                                }
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handleArchiveAction("edit", archive, e)
                                }
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handleArchiveAction("unarchive", archive, e)
                                }
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Unarchive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handleArchiveAction("delete", archive, e)
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

                    {archive.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {archive.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-white/60 text-xs mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(archive.archivedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {archive.messageCount} messages
                      </div>
                    </div>

                    {archive.tags && archive.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {archive.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-white/20 text-white"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {archive.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/20 text-white"
                          >
                            +{archive.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
