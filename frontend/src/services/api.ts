// src/services/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// -----------------------------
// Core API Request Wrapper
// -----------------------------
async function request(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Final request
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle non-OK responses
  if (!res.ok) {
    let errorMessage = "API Error";

    try {
      const data = await res.json();
      errorMessage = data.message || JSON.stringify(data);
    } catch {
      errorMessage = await res.text();
    }

    throw new Error(errorMessage || "Unknown API error");
  }

  // Safe JSON parse
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// -----------------------------
// Exported API methods
// -----------------------------
export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: any) =>
    request(url, { method: "POST", body: JSON.stringify(body) }),
  postForm: (url: string, formData: FormData) =>
    request(url, { method: "POST", body: formData }),
  put: (url: string, body: any) =>
    request(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: "DELETE" }),
};
