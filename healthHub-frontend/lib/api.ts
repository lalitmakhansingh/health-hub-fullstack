export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Request failed")
  return data
}