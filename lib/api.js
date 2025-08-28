import axios from "axios";
import { CourseApi, ConversationApi } from "@/ApiConstants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 5 minutes timeout
});

// Helper function to get auth headers
const getAuthHeaders = async () => {
  if (typeof window !== "undefined") {
    // Client-side: get session from NextAuth
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    if (session?.accessToken) {
      return {
        Authorization: `Bearer ${session.accessToken}`,
      };
    }
  }
  return {};
};

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  async (config) => {
    const authHeaders = await getAuthHeaders();
    config.headers = {
      ...config.headers,
      ...authHeaders,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: No response from server");
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

// Course APIs
export async function uploadVttFiles(files, options = {}) {
  const { section } = options;
  const form = new FormData();
  Array.from(files).forEach((file) => form.append("files", file));
  if (section) form.append("section", section);

  try {
    const response = await apiClient.post(CourseApi.AddingSourse, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function askQuestion(question, options = {}) {
  const { section } = options;

  try {
    const response = await apiClient.post(CourseApi.AnswerQuestion, {
      question,
      section,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Ask failed: ${error.message}`);
  }
}

// Conversation APIs
export async function createConversation(title) {
  try {
    const response = await apiClient.post(ConversationApi.CreateConversation, {
      title,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Create conversation failed: ${error.message}`);
  }
}

export async function getAllConversations(options = {}) {
  const { page = 1, limit = 20, search } = options;

  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);

    const response = await apiClient.get(
      `${ConversationApi.GetAllConversations}?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Get conversations failed: ${error.message}`);
  }
}

export async function getConversationStats() {
  try {
    const response = await apiClient.get(ConversationApi.GetConversationStats);
    return response.data;
  } catch (error) {
    throw new Error(`Get conversation stats failed: ${error.message}`);
  }
}

export async function getConversation(conversationId) {
  try {
    const response = await apiClient.get(
      ConversationApi.GetConversation.replace(":conversationId", conversationId)
    );
    return response.data;
  } catch (error) {
    throw new Error(`Get conversation failed: ${error.message}`);
  }
}

export async function updateConversation(conversationId, title) {
  try {
    const response = await apiClient.post(
      ConversationApi.UpdateConversation.replace(
        ":conversationId",
        conversationId
      ),
      { title }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Update conversation failed: ${error.message}`);
  }
}

export async function deleteConversation(conversationId) {
  try {
    const response = await apiClient.delete(
      ConversationApi.DeleteConversation.replace(
        ":conversationId",
        conversationId
      )
    );
    return response.data;
  } catch (error) {
    throw new Error(`Delete conversation failed: ${error.message}`);
  }
}
