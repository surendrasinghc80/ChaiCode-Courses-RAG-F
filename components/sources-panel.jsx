"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FileText,
  File,
  ImageIcon,
  Music,
  Video,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadVttFiles } from "@/lib/api";
import { useVttFiles } from "@/contexts/VttFilesContext";
import { SourceSearch } from "./source-search";
import { SourcePreviewModal } from "./source-preview-modal";

const getFileIcon = (fileType) => {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType.startsWith("audio/")) return Music;
  if (fileType.startsWith("video/")) return Video;
  if (fileType.includes("pdf")) return FileText;
  return File;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export function SourcesPanel({
  sources,
  onAddSources,
  onDeleteSource,
  // onShowAddModal,
}) {
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedSource, setSelectedSource] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [uploading, setUploading] = useState(false);

  // Use VTT files context
  const {
    files: vttFiles,
    addFiles,
    deleteFile,
    setLoading,
    setError,
    formatFileSize,
    getTotalFiles,
    getTotalSize,
  } = useVttFiles();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const vttFiles = acceptedFiles.filter(
        (f) => f.type === "text/vtt" || f.name?.toLowerCase().endsWith(".vtt")
      );

      if (vttFiles.length === 0) {
        alert("Please upload .vtt files only.");
        return;
      }

      try {
        setUploading(true);
        setLoading(true);
        const res = await uploadVttFiles(vttFiles);

        // Create processed sources from backend response
        const newSources = (res?.files || vttFiles).map((f, idx) => ({
          id: Date.now() + idx,
          name: f.file || vttFiles[idx]?.name || `VTT ${idx + 1}`,
          type: "text/vtt",
          size: vttFiles[idx]?.size || 0,
          uploadedAt: new Date(),
          status: "processed",
          content: undefined,
          metadata: {
            processingTime: "1.2s",
            chunks: 1,
          },
        }));

        // Add to context
        addFiles(
          newSources.map((source) => ({
            fileName: source.name,
            fileSize: source.size,
            uploadedDate: source.uploadedAt,
            id: source.id,
          }))
        );

        // Also add to sources for backward compatibility
        onAddSources(newSources);
      } catch (err) {
        console.error("VTT upload failed", err);
        setError(err?.message || err);
        alert(`Upload failed: ${err?.message || err}`);
      } finally {
        setUploading(false);
        setLoading(false);
      }
    },
    [onAddSources]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/vtt": [".vtt"] },
    multiple: true,
  });

  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    setShowPreview(true);
  };

  const handleSourceUpdate = (updatedSource) => {
    // Handle source updates
    console.log("Updating source:", updatedSource);
  };

  const processingCount = sources.filter(
    (s) => s.status === "processing"
  ).length;
  const processedCount = sources.filter((s) => s.status === "processed").length;
  const errorCount = sources.filter((s) => s.status === "error").length;

  return (
    <>
      <div className="w-80 h-full border-r border-white/10 bg-black/20 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Sources</h2>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onShowAddModal}
              className="text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button> */}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full position-sticky top-0 z-10"
          >
            <TabsList className="grid w-full grid-cols-2 bg-transparent border border-white/20">
              <TabsTrigger
                value="all"
                className="text-white text-xs data-[state=active]:bg-white/10"
              >
                All ({sources.length})
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="text-white text-xs data-[state=active]:bg-white/10"
              >
                <Search className="h-3 w-3 mr-1" />
                Search
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="all" className="mt-0">
                <div className="flex flex-col">
                  {/* Upload Progress */}
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="mb-3">
                      <Card className="bg-white/10 border-white/20 p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <Upload className="h-4 w-4 text-blue-400" />
                          <span className="text-white text-sm">
                            Processing...
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-white/40 text-xs mt-1">
                          {progress}% complete
                        </p>
                      </Card>
                    </div>
                  ))}

                  {/* Status Summary */}
                  {sources.length > 0 && (
                    <div className="mb-4 flex gap-2">
                      {processedCount > 0 && (
                        <Badge
                          variant="default"
                          className="text-xs bg-green-600"
                        >
                          {processedCount} ready
                        </Badge>
                      )}
                      {processingCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-600"
                        >
                          {processingCount} processing
                        </Badge>
                      )}
                      {errorCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {errorCount} failed
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Sources List */}
                  {sources.length > 0 ? (
                    <div className="space-y-3">
                      {sources.map((source) => {
                        const IconComponent = getFileIcon(source.type);
                        return (
                          <Card
                            key={source.id}
                            className="bg-white/10 border-white/20 p-3 hover:bg-white/15 transition-colors cursor-pointer"
                            onClick={() => handleSourceSelect(source)}
                          >
                            <div className="flex items-start gap-3">
                              <IconComponent className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white text-sm font-medium truncate">
                                  {source.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant={
                                      source.status === "processed"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {source.status}
                                  </Badge>
                                  <span className="text-white/40 text-xs">
                                    {formatFileSize(source.size)}
                                  </span>
                                </div>
                                <p className="text-white/40 text-xs mt-1">
                                  Added {source.uploadedAt.toLocaleDateString()}
                                </p>
                                {source.metadata && (
                                  <p className="text-white/40 text-xs">
                                    {source.metadata.wordCount} words •{" "}
                                    {source.metadata.chunks} chunks
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSourceSelect(source);
                                  }}
                                  className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSource(source.id);
                                  }}
                                  className="h-6 w-6 p-0 text-white/60 hover:text-red-400 hover:bg-white/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      {/* Drop Zone */}
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDragActive
                            ? "border-blue-400 bg-blue-400/10"
                            : "border-white/20 hover:border-white/30"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-8 w-8 text-white/40 mx-auto mb-3" />
                        <p className="text-white/60 text-sm mb-2">
                          {isDragActive
                            ? "Drop .vtt files here..."
                            : "Drag & drop .vtt files here"}
                        </p>
                        <p className="text-white/40 text-xs">
                          or{" "}
                          <span className="text-blue-400 cursor-pointer">
                            browse .vtt files
                          </span>
                        </p>
                        {uploading && (
                          <p className="text-white/60 text-xs mt-2">
                            Uploading...
                          </p>
                        )}
                      </div>

                      <div className="mt-6 text-center">
                        <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60 text-sm mb-2">
                          No sources yet
                        </p>
                        <p className="text-white/40 text-xs">
                          Add documents to start chatting with your content
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="search" className="mt-0">
                <SourceSearch
                  sources={sources}
                  onSourceSelect={handleSourceSelect}
                  onFilterChange={(filters) => console.log("Filters:", filters)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Source Count */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Sources</span>
            <Badge variant="secondary">{sources.length}/50</Badge>
          </div>
        </div>
      </div>

      {/* Source Preview Modal */}
      <SourcePreviewModal
        source={selectedSource}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setSelectedSource(null);
        }}
        onDelete={onDeleteSource}
        onUpdate={handleSourceUpdate}
      />
    </>
  );
}
