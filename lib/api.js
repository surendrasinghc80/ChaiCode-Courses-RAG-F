import { CourseApi, ChatApi } from "@/ApiConstants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_BACKEND_URL) is not set. API calls will hit relative paths."
  );
}

// Course APIs
export async function uploadVttFiles(files, options = {}) {
  const { section } = options;
  const form = new FormData();
  Array.from(files).forEach((file) => form.append("files", file));
  if (section) form.append("section", section);

  const res = await fetch(`${BASE_URL}${CourseApi.AddingSourse}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function askQuestion(question, options = {}) {
  const { section } = options;
  const res = await fetch(`${BASE_URL}${CourseApi.AnswerQuestion}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, section }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ask failed: ${res.status} ${text}`);
  }
  return res.json();
}

// Chat APIs
export async function createChat(chatData) {
  const response = await fetch(`${BASE_URL}${ChatApi.CreateChat}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create chat: ${error}`);
  }

  return response.json();
}

export async function getChatHistory(conversationId, options = {}) {
  const { limit = 50, offset = 0 } = options;
  const params = new URLSearchParams({ limit, offset });

  const response = await fetch(
    `${BASE_URL}${ChatApi.GetChatHistory}/${conversationId}?${params}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get chat history: ${error}`);
  }

  return response.json();
}

export async function getUserConversations(userId, options = {}) {
  const { limit = 20, offset = 0 } = options;
  const params = new URLSearchParams({ limit, offset });

  const response = await fetch(
    `${BASE_URL}${ChatApi.GetUserConversations}/${userId}/conversations?${params}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user conversations: ${error}`);
  }

  return response.json();
}

export async function searchChats(query, options = {}) {
  const { userId, conversationId, limit = 20, offset = 0 } = options;
  const params = new URLSearchParams({ query, limit, offset });

  if (userId) params.append("userId", userId);
  if (conversationId) params.append("conversationId", conversationId);

  const response = await fetch(`${BASE_URL}${ChatApi.SearchChats}?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to search chats: ${error}`);
  }

  return response.json();
}

export async function deleteConversation(conversationId) {
  const response = await fetch(
    `${BASE_URL}${ChatApi.DeleteConversation}/${conversationId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete conversation: ${error}`);
  }

  return response.json();
}

export async function getChatStats(userId = null) {
  const endpoint = userId
    ? `${ChatApi.GetChatStats}/${userId}`
    : ChatApi.GetChatStats;
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get chat stats: ${error}`);
  }

  return response.json();
}

// Chat Storage Service
export class ChatStorageService {
  static generateUserId() {
    let userId = localStorage.getItem("chat_user_id");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("chat_user_id", userId);
    }
    return userId;
  }

  static generateConversationId() {
    return crypto.randomUUID();
  }

  static getCurrentConversationId() {
    return localStorage.getItem("current_conversation_id");
  }

  static setCurrentConversationId(conversationId) {
    localStorage.setItem("current_conversation_id", conversationId);
  }

  static clearCurrentConversation() {
    localStorage.removeItem("current_conversation_id");
  }

  static async saveMessage(message, role, options = {}) {
    const userId = this.generateUserId();
    let conversationId = this.getCurrentConversationId();

    if (!conversationId) {
      conversationId = this.generateConversationId();
      this.setCurrentConversationId(conversationId);
    }

    const chatData = {
      conversationId,
      userId,
      message,
      role,
      metadata: options.metadata || {},
      vectorId: options.vectorId || null,
    };

    try {
      const result = await createChat(chatData);
      return result.data;
    } catch (error) {
      console.error("Failed to save message:", error);
      throw error;
    }
  }

  static async loadConversationHistory(conversationId) {
    try {
      const result = await getChatHistory(conversationId);
      return result.data.chats;
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      return [];
    }
  }
}
