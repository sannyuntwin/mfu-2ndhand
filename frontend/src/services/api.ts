export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API Error");
  }

  return res.json();
}

export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: any) =>
    request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: any) =>
    request(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) =>
    request(url, { method: "DELETE" }),
};
