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
