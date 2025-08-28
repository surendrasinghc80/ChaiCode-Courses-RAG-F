"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, Share2, Globe, Lock, Users } from "lucide-react";

export function ShareModal({
  isOpen,
  onClose,
  conversationId,
  conversationTitle,
}) {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState("public"); // public, private

  const shareUrl = `${window.location.origin}/shared/${conversationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Conversation
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share "{conversationTitle}" with others. They'll need to log in to
            view it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Share Settings
            </label>
            <div className="flex gap-2">
              <Button
                variant={shareType === "public" ? "default" : "outline"}
                size="sm"
                onClick={() => setShareType("public")}
                className="flex-1"
              >
                <Globe className="h-4 w-4 mr-2" />
                Public Link
              </Button>
              <Button
                variant={shareType === "private" ? "default" : "outline"}
                size="sm"
                onClick={() => setShareType("private")}
                className="flex-1"
                disabled
              >
                <Lock className="h-4 w-4 mr-2" />
                Private (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-gray-800 border-gray-600 text-gray-300"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="px-3"
                variant="outline"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-300 font-medium">
                  Authentication Required
                </p>
                <p className="text-blue-200/80 mt-1">
                  Anyone with this link can view the conversation, but they must
                  be logged in to access it. The conversation will be read-only
                  for viewers.
                </p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCopyLink}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
