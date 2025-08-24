import { CourseApi } from "@/ApiConstants";

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

// Course APIs
export async function uploadVttFiles(files, options = {}) {
  const { section } = options;
  const form = new FormData();
  Array.from(files).forEach((file) => form.append("files", file));
  if (section) form.append("section", section);

  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}${CourseApi.AddingSourse}`, {
    method: "POST",
    headers: {
      ...authHeaders,
    },
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
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}${CourseApi.AnswerQuestion}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({ question, section }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ask failed: ${res.status} ${text}`);
  }
  return res.json();
}
