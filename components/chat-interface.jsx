"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Send,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  User,
  Bot,
  FileText,
  ExternalLink,
  Search,
  Zap,
  AlertCircle,
  Volume2,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RAGService } from "@/lib/rag-service";
import { askQuestion, getConversation } from "@/lib/api";
import CodeBlock from "@/components/code-block";

const TypingIndicator = ({ stage = "thinking" }) => {
  const stages = {
    thinking: "Analyzing your question...",
    searching: "Searching through your sources...",
    generating: "Generating response...",
  };

  return (
    <div className="flex items-center gap-2 p-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-blue-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-white/60 text-sm">{stages[stage]}</span>
        {stage === "searching" && (
          <Search className="h-4 w-4 text-blue-400 animate-pulse" />
        )}
        {stage === "generating" && (
          <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
        )}
      </div>
    </div>
  );
};

// Parses content for fenced code blocks ```lang\ncode\n```
function renderMessageContent(content) {
  if (!content) return null;
  const parts = [];
  const regex = /```([\w+-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [full, langRaw, code] = match;
    const lang = langRaw || "";
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      parts.push(
        <p key={`t-${lastIndex}`} className="whitespace-pre-wrap">
          {text}
        </p>
      );
    }
    parts.push(
      <CodeBlock
        key={`c-${match.index}`}
        language={lang || undefined}
        value={code}
      />
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex);
    parts.push(
      <p key={`t-${lastIndex}-end`} className="whitespace-pre-wrap">
        {tail}
      </p>
    );
  }
  return <div className="prose prose-sm max-w-none">{parts}</div>;
}

const MessageBubble = ({
  message,
  onCopy,
  onRegenerate,
  onFeedback,
  onSpeak,
  isSpeaking,
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[80%] space-y-2", isUser && "order-first")}>
        <Card
          className={cn(
            "p-4",
            isUser
              ? "bg-blue-600 text-white ml-auto"
              : "bg-white/10 border-white/20 text-white"
          )}
        >
          {renderMessageContent(message.content)}

          {/* RAG Context Info */}
          {message.ragInfo && !isUser && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-3 w-3 text-white/60" />
                <span className="text-xs text-white/60">
                  Found {message.ragInfo.usedChunks} relevant passages from{" "}
                  {message.ragInfo.sources.length} source
                  {message.ragInfo.sources.length !== 1 ? "s" : ""}
                </span>
                {message.ragInfo.confidence && (
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(message.ragInfo.confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Source Citations */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-white/60 mb-2">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {source.name}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center gap-2 px-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(message.content)}
              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(message)}
              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/10"
              aria-label={isSpeaking ? "Stop audio" : "Play audio"}
              title={isSpeaking ? "Stop" : "Listen"}
            >
              {isSpeaking ? (
                <Square className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRegenerate(message.id)}
              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, "up")}
              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, "down")}
              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-gray-600 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export function ChatInterface({
  sources,
  onSendMessage,
  conversationId = null,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStage, setTypingStage] = useState("thinking");
  const [ragService, setRagService] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // TTS state
  const [speakingId, setSpeakingId] = useState(null);
  const ttsUtteranceRef = useRef(null);
  // ElevenLabs audio playback
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Initialize RAG service when sources change
  useEffect(() => {
    const processedSources = sources.filter(
      (source) => source.status === "processed"
    );
    const newRagService = new RAGService(processedSources);
    setRagService(newRagService);
  }, [sources]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load conversation messages if conversationId is provided
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages();
    }
  }, [conversationId]);

  const loadConversationMessages = async () => {
    try {
      const response = await getConversation(conversationId);
      if (response.success && response.data.conversation.messages) {
        const convertedMessages = response.data.conversation.messages.map(
          (msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.message,
            timestamp: msg.timestamp,
            sources: [],
            ragInfo: null,
            error: null,
          })
        );
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error("Failed to load conversation messages:", error);
    }
  };

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    };
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuery = inputValue;
    setInputValue("");
    setIsTyping(true);
    setTypingStage("thinking");

    try {
      setTimeout(() => setTypingStage("searching"), 400);
      setTypingStage("generating");

      const backend = await askQuestion(currentQuery, { conversationId });

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: backend.data?.answer || "No answer returned.",
        timestamp: new Date(),
        sources: (backend.data?.references || []).map((r) => ({
          name: `${r.file} • ${r.section} • ${r.start} → ${r.end}`,
        })),
        ragInfo: backend.data?.references
          ? {
              usedChunks: backend.data.references.length,
              sources: backend.data.references,
              confidence: backend.data.references[0]?.score,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error generating response:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I apologize, but I encountered an error while processing your question. Please try again or rephrase your question.",
        timestamp: new Date(),
        sources: [],
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }

    // Call parent handler if provided
    if (onSendMessage) {
      onSendMessage(currentQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleRegenerate = async (messageId) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      setIsTyping(true);
      setTypingStage("thinking");

      setTimeout(() => setTypingStage("searching"), 500);

      setTimeout(async () => {
        setTypingStage("generating");

        const backend = await askQuestion(userMessage.content);
        const newAiMessage = {
          id: Date.now(),
          role: "assistant",
          content: backend.answer || "No answer returned.",
          timestamp: new Date(),
          sources: (backend.references || []).map((r) => ({
            name: `${r.file} • ${r.section} • ${r.start} → ${r.end}`,
          })),
          ragInfo: backend.references
            ? {
                usedChunks: backend.references.length,
                sources: backend.references,
                confidence: backend.references[0]?.score,
              }
            : undefined,
        };

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[messageIndex] = newAiMessage;
          return newMessages;
        });

        setIsTyping(false);
      }, 800);
    }
  };

  const handleFeedback = (messageId, type) => {
    // Handle thumbs up/down feedback
    console.log(`Feedback for message ${messageId}: ${type}`);
    // Could send to analytics or improve model
  };

  // --- Text-to-Speech Helpers ---
  const sanitizeForSpeech = (text) => {
    if (!text) return "";
    let out = text;
    // 1) Remove fenced code blocks
    out = out.replace(/```[\s\S]*?```/g, "");
    // 2) Remove bracketed citations like [Section: ..., 00:03:40.080 → 00:04:24.230]
    out = out.replace(/\[Section:[^\]]*\]/gi, "");
    // 3) Remove any bracketed content that contains timestamps
    out = out.replace(
      /\[[^\]]*\b\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?[^\]]*\]/g,
      ""
    );
    // 4) Remove explicit time ranges like 00:03:40.080 → 00:04:24.230
    out = out.replace(
      /\b\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?\s*→\s*\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?\b/g,
      ""
    );
    // 5) Remove standalone timestamps like 00:07:17.990 or 03:40 or 07:17:59
    out = out.replace(/\b\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?\b/g, "");
    // 6) Remove leftover empty brackets and extra punctuation
    out = out.replace(/\[\s*\]/g, "");
    // 7) Collapse multiple whitespace/newlines and make smoother sentences
    out = out.replace(/\n{2,}/g, ". ");
    out = out.replace(/\s{2,}/g, " ");
    return out.trim();
  };

  const stopSpeaking = () => {
    try {
      // Stop browser TTS if any
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Stop ElevenLabs audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    } catch {}
    ttsUtteranceRef.current = null;
    setSpeakingId(null);
  };

  const handleSpeak = (message) => {
    // Toggle behavior
    if (speakingId === message.id) {
      stopSpeaking();
      return;
    }

    // Stop any current
    stopSpeaking();

    // Prefer ElevenLabs via /api/tts
    (async () => {
      try {
        const text = sanitizeForSpeech(message.content);
        if (!text) return;
        setSpeakingId(message.id);
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voiceId: process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || undefined,
          }),
        });
        if (!res.ok) {
          setSpeakingId(null);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeakingId(null);
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
          audioRef.current = null;
        };
        audio.onerror = () => {
          setSpeakingId(null);
        };
        await audio.play();
      } catch (e) {
        setSpeakingId(null);
      }
    })();
  };

  const hasMessages = messages.length > 0;
  const processedSources = sources.filter((s) => s.status === "processed");
  const ragStats = ragService
    ? {
        totalChunks: processedSources.length * 10, // Estimated
        avgChunkSize: 150, // Estimated words per chunk
      }
    : null;

  const canSendMessage = inputValue.trim().length > 0 && !isTyping;

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-medium">Chat</h2>
          <div className="flex items-center gap-2">
            {processedSources.length > 0 && (
              <Badge variant="outline" className="text-white border-white/20">
                {processedSources.length} source
                {processedSources.length !== 1 ? "s" : ""} ready
              </Badge>
            )}
          </div>
        </div>
        {ragStats && (
          <div>
            <p className="text-white/40 text-xs mt-1">
              RAG system ready • {ragStats.avgChunkSize} avg words per chunk
            </p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!hasMessages && sources.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white text-lg mb-2">
                Add sources to get started
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Upload documents, add websites, or paste text to begin chatting
                with your content using RAG.
              </p>
            </div>
          </div>
        ) : !hasMessages && processedSources.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white text-lg mb-2">
                Sources are processing
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Please wait while your sources are being processed for chat.
                This usually takes a few moments.
              </p>
              <div className="flex justify-center">
                <Progress
                  value={(processedSources.length / sources.length) * 100}
                  className="w-48 h-2"
                />
              </div>
            </div>
          </div>
        ) : !hasMessages ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white text-lg mb-2">
                Ready to chat with your sources!
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Ask questions about your {processedSources.length} processed
                source
                {processedSources.length !== 1 ? "s" : ""}. I'll search through
                your content and provide contextual answers.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputValue(
                      "What are the main topics covered in my sources?"
                    )
                  }
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Summarize main topics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputValue(
                      "What are the key insights from my documents?"
                    )
                  }
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Find key insights
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputValue("How do my sources relate to each other?")
                  }
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Find connections
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
                onSpeak={handleSpeak}
                isSpeaking={speakingId === message.id}
              />
            ))}
            {isTyping && <TypingIndicator stage={typingStage} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                processedSources.length === 0
                  ? "Ask any question or upload sources for RAG-powered responses..."
                  : "Ask questions about your sources..."
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 resize-none min-h-[44px] max-h-32"
              disabled={false}
              rows={1}
              style={{
                height: "auto",
                minHeight: "44px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!canSendMessage}
            className="bg-blue-600 hover:bg-blue-700 mb-2 disabled:bg-gray-600 h-11 px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-white/40 text-xs mt-2 text-center">
          RAG-powered responses based on couses sub-titles • ChaiCode - RAG can
          be inaccurate, please double-check responses.
        </p>
      </div>
    </div>
  );
}
