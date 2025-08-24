import axios from "axios";
import { CourseApi } from "@/ApiConstants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
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
