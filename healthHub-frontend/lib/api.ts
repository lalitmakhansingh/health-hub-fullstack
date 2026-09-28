export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const contentType = res.headers.get("content-type") || ""

  let data

  if (contentType.includes("application/json")) {
    data = await res.json()
  } else {
    data = {
      message: await res.text(),
    }
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed")
  }

  return data
}