import axios from "axios";
import { CourseApi, ConversationApi, ArchiveApi } from "@/ApiConstants";

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

export async function askQuestion(question, options = {}) {
  const { section, conversationId } = options;

  try {
    const response = await apiClient.post(CourseApi.AnswerQuestion, {
      question,
      section,
      conversationId,
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

// Archive APIs
export async function archiveConversation(conversationId, archiveData = {}) {
  try {
    const response = await apiClient.post(
      ArchiveApi.ArchiveConversation.replace(":conversationId", conversationId),
      archiveData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Archive conversation failed: ${error.message}`);
  }
}

export async function getAllArchives(options = {}) {
  const { page = 1, limit = 20, search, tags, sortBy, sortOrder } = options;

  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (tags) params.append("tags", tags);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await apiClient.get(
      `${ArchiveApi.GetAllArchives}?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Get archives failed: ${error.message}`);
  }
}

export async function getArchiveStats() {
  try {
    const response = await apiClient.get(ArchiveApi.GetArchiveStats);
    return response.data;
  } catch (error) {
    throw new Error(`Get archive stats failed: ${error.message}`);
  }
}

export async function getArchivedConversation(archiveId) {
  try {
    const response = await apiClient.get(
      ArchiveApi.GetArchivedConversation.replace(":archiveId", archiveId)
    );
    return response.data;
  } catch (error) {
    throw new Error(`Get archived conversation failed: ${error.message}`);
  }
}

export async function updateArchivedConversation(archiveId, updateData) {
  try {
    const response = await apiClient.post(
      ArchiveApi.UpdateArchivedConversation.replace(":archiveId", archiveId),
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Update archived conversation failed: ${error.message}`);
  }
}

export async function deleteArchivedConversation(archiveId) {
  try {
    const response = await apiClient.delete(
      ArchiveApi.DeleteArchivedConversation.replace(":archiveId", archiveId)
    );
    return response.data;
  } catch (error) {
    throw new Error(`Delete archived conversation failed: ${error.message}`);
  }
}

export async function unarchiveConversation(archiveId) {
  try {
    const response = await apiClient.post(
      ArchiveApi.UnarchiveConversation.replace(":archiveId", archiveId)
    );
    return response.data;
  } catch (error) {
    throw new Error(`Unarchive conversation failed: ${error.message}`);
  }
}

export async function getArchivedConversationByConversationId(conversationId) {
  try {
    const response = await getUserArchives();
    if (response.success) {
      const archive = response.data.archives.find(
        arch => arch.conversationId === conversationId
      );
      return { success: true, data: archive };
    }
    return { success: false, data: null };
  } catch (error) {
    return { success: false, data: null };
  }
}
