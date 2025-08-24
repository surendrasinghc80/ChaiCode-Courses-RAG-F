const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

if (!BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. API calls will hit relative paths."
  );
}

/**
 * Chat API Service - Handles all chat-related API calls
 */
export class ChatAPI {
  static async createChat(chatData) {
    const response = await fetch(`${BASE_URL}/api/chat`, {
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

  static async getChatHistory(conversationId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const params = new URLSearchParams({ limit, offset });

    const response = await fetch(
      `${BASE_URL}/api/chat/conversation/${conversationId}?${params}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get chat history: ${error}`);
    }

    return response.json();
  }

  static async getUserConversations(userId, options = {}) {
    const { limit = 20, offset = 0 } = options;
    const params = new URLSearchParams({ limit, offset });

    const response = await fetch(
      `${BASE_URL}/api/chat/user/${userId}/conversations?${params}`
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user conversations: ${error}`);
    }

    return response.json();
  }

  static async searchChats(query, options = {}) {
    const { userId, conversationId, limit = 20, offset = 0 } = options;
    const params = new URLSearchParams({ query, limit, offset });

    if (userId) params.append("userId", userId);
    if (conversationId) params.append("conversationId", conversationId);

    const response = await fetch(`${BASE_URL}/api/chat/search?${params}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to search chats: ${error}`);
    }

    return response.json();
  }

  static async deleteConversation(conversationId) {
    const response = await fetch(
      `${BASE_URL}/api/chat/conversation/${conversationId}`,
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

  static async getChatStats(userId = null) {
    const endpoint = userId ? `/api/chat/stats/${userId}` : "/api/chat/stats";
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get chat stats: ${error}`);
    }

    return response.json();
  }
}

/**
 * Chat Storage Service - Manages local chat state and persistence
 */
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
      const result = await ChatAPI.createChat(chatData);
      return result.data;
    } catch (error) {
      console.error("Failed to save message:", error);
      throw error;
    }
  }

  static async loadConversationHistory(conversationId) {
    try {
      const result = await ChatAPI.getChatHistory(conversationId);
      return result.data.chats;
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      return [];
    }
  }
}
