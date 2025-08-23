"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Upload,
  FileText,
  Globe,
  Youtube,
  Copy,
  Brain,
  FolderOpen,
  Presentation,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadVttFiles } from "@/lib/api";

export function AddSourcesModal({ isOpen, onClose, onAddSources }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [uploading, setUploading] = useState(false);

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
        const res = await uploadVttFiles(vttFiles);
        // Create processed sources from backend response
        const newSources = (res?.files || vttFiles).map((f, idx) => ({
          id: Date.now() + idx,
          name: f.file || vttFiles[idx]?.name || `VTT ${idx + 1}`,
          type: "text/vtt",
          size: 0,
          uploadedAt: new Date(),
          status: "processed",
          content: undefined,
        }));
        onAddSources(newSources);
        onClose();
      } catch (err) {
        console.error("VTT upload failed", err);
        alert(`Upload failed: ${err?.message || err}`);
      } finally {
        setUploading(false);
      }
    },
    [onAddSources, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/vtt": [".vtt"] },
    multiple: true,
  });

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const newSource = {
        id: Date.now(),
        name: urlInput,
        type: "url",
        size: 0,
        uploadedAt: new Date(),
        status: "processing",
      };
      onAddSources([newSource]);
      setUrlInput("");
      onClose();
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      const newSource = {
        id: Date.now(),
        name: "Pasted Text",
        type: "text/plain",
        size: textInput.length,
        uploadedAt: new Date(),
        status: "processed",
        content: textInput,
      };
      onAddSources([newSource]);
      setTextInput("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-full max-w-3xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-white" />
            <h2 className="text-white font-medium">NotebookLM</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <h3 className="text-white text-lg mb-2">Add sources</h3>
          <p className="text-white/60 text-sm mb-6">
            Sources let NotebookLM base its responses on the information that
            matters most to you.
            <br />
            (Examples: marketing plans, course reading, research notes, meeting
            transcripts, sales documents, etc.)
          </p>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="upload" className="text-white">
                Upload
              </TabsTrigger>
              <TabsTrigger value="link" className="text-white">
                Link
              </TabsTrigger>
              <TabsTrigger value="text" className="text-white">
                Text
              </TabsTrigger>
              <TabsTrigger value="integrations" className="text-white">
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-400/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <input {...getInputProps()} disabled={uploading} />
                <Upload className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h4 className="text-white mb-2">
                  {isDragActive
                    ? "Drop .vtt files here"
                    : "Upload .vtt transcript files"}
                </h4>
                <p className="text-white/60 text-sm mb-4">
                  Drag and drop or{" "}
                  <span className="text-blue-400 cursor-pointer">
                    choose file
                  </span>{" "}
                  to upload
                </p>
                <p className="text-white/40 text-xs">
                  Supported: .vtt (WebVTT captions)
                </p>
                {uploading && (
                  <p className="text-white/60 text-xs mt-2">Uploading...</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Website URL or YouTube link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com or https://youtube.com/watch?v=..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                    />
                    <Button onClick={handleAddUrl} disabled={!urlInput.trim()}>
                      Add
                    </Button>
                  </div>
                </div>
                <p className="text-white/40 text-xs">
                  We'll extract the content from the webpage or YouTube video
                  transcript.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Paste your text
                  </label>
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your text content here..."
                    className="min-h-[200px] bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="w-full"
                >
                  Add Text Source
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="mt-6">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <FolderOpen className="h-5 w-5" />
                  <span className="text-sm">Google Drive</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Google Docs</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Presentation className="h-5 w-5" />
                  <span className="text-sm">Google Slides</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">Website</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Youtube className="h-5 w-5" />
                  <span className="text-sm">YouTube</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto p-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Copy className="h-5 w-5" />
                  <span className="text-sm">Clipboard</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
