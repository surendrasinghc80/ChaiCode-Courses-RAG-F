"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Archive,
  Edit,
  Calendar,
  MessageSquare,
  Tag,
  ExternalLink,
  FileText,
  Video,
  Link,
  Save,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getArchivedConversation, updateArchivedConversation } from "@/lib/api";

export default function ArchivedConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const archiveId = params.archiveId;
  const [archive, setArchive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allReferences, setAllReferences] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [editLoading, setEditLoading] = useState(false);

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
        const archiveData = response.data.archive;
        setArchive(archiveData);
        const msgs = response.data.messages || [];
        setMessages(msgs);

        // Initialize edit form with current archive data
        setEditForm({
          title: archiveData.title || "",
          description: archiveData.description || "",
          tags: archiveData.tags || [],
        });

        // Extract all unique references from messages
        const refs = new Map();
        msgs.forEach((msg) => {
          if (msg.metadata?.references) {
            msg.metadata.references.forEach((ref) => {
              const key = `${ref.file}-${ref.section}`;
              if (!refs.has(key)) {
                refs.set(key, {
                  file: ref.file,
                  section: ref.section,
                  timeRange: `${ref.start} → ${ref.end}`,
                  score: ref.score,
                  usageCount: 1,
                });
              } else {
                refs.get(key).usageCount++;
              }
            });
          }
        });

        setAllReferences(Array.from(refs.values()));
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

  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const response = await updateArchivedConversation(archiveId, editForm);
      if (response.success) {
        setArchive((prev) => ({
          ...prev,
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags,
        }));
        setIsEditDialogOpen(false);
      } else {
        console.error("Failed to update archive:", response.message);
      }
    } catch (err) {
      console.error("Error updating archive:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setEditForm((prev) => ({ ...prev, tags }));
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
        <div className="text-center">
          <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground text-xl mb-2">No archive found</h3>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button
            onClick={() => router.push("/archives")}
            className="bg-primary hover:bg-primary/90"
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
      <div className="fixed inset-0 bg-background/70 backdrop-blur-md z-10" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex-shrink-0 bg-background/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/archives")}
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Archives
              </Button>
              <div>
                <h1 className="text-foreground text-lg font-medium flex items-center gap-2">
                  {archive?.title}
                </h1>
                {archive?.description && (
                  <p className="text-muted-foreground text-sm">
                    {archive.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-foreground border-border"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Badge>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="text-foreground border-border hover:bg-accent"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Archive Info */}
          {archive && (
            <div className="mt-3 flex items-center gap-6 text-muted-foreground text-sm">
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
                  variant="outline"
                  className="text-foreground border-border"
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

        {/* Main Content Area */}
        <div className="flex-1 flex min-w-0">
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* <ChatInterface
              sources={[]}
              conversationId={archive?.conversationId}
              showHeader={false}
              readOnly={true}
              initialMessages={messages}
            /> */}
          </div>

          {/* References Panel */}
          {allReferences.length > 0 && (
            <div className="w-80 bg-background/50 border-l border-border/50 p-4 overflow-y-auto backdrop-blur-md">
              <h3 className="text-foreground text-sm font-medium mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                References
              </h3>
              <p className="text-muted-foreground text-xs text-center py-8">
                {allReferences.length} source
                {allReferences.length !== 1 ? "s" : ""} referenced in this
                conversation
              </p>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {allReferences.map((ref, index) => (
                  <div
                    key={index}
                    className="bg-card/50 border border-border/50 rounded-lg p-3 hover:bg-card/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="text-sm text-foreground font-medium truncate">
                          {ref.file}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-secondary text-secondary-foreground ml-2"
                      >
                        {ref.usageCount}x
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs">
                        <span className="font-medium">Section:</span>{" "}
                        {ref.section}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        <span className="font-medium">Time:</span>{" "}
                        {ref.timeRange}
                      </div>
                      {ref.score && (
                        <div className="text-muted-foreground text-xs">
                          <span className="font-medium">Relevance:</span>{" "}
                          {(ref.score * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-muted-foreground hover:text-foreground hover:bg-accent justify-start"
                      onClick={() => window.open(ref.url, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View in source
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Archive Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              <Edit className="h-4 w-4" />
              Edit Archive
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the archive title, description, and tags.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">
                Title
              </label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter archive title"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">
                Description
              </label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter archive description"
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>

            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">
                Tags
              </label>
              <Input
                value={editForm.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., nodejs, important, tutorial)"
                className="bg-background border-border text-foreground"
              />
              <p className="text-muted-foreground text-xs mt-3">
                Separate multiple tags with commas
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={editLoading}
              className="bg-secondary hover:bg-secondary/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={editLoading || !editForm.title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
