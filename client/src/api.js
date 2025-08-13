const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const { cacheBust = false, ...rest } = options;

  // Build URL and optionally add a cache-busting query param for GETs
  const url = new URL(`${API_URL}${path}`, window.location.origin);
  if (cacheBust && (!rest.method || rest.method.toUpperCase() === "GET")) {
    url.searchParams.set("_t", Date.now().toString());
  }

  // Decide headers: avoid Content-Type for GET without a body
  const isGet = (!rest.method || rest.method.toUpperCase() === "GET");
  const baseHeaders = {
    "Cache-Control": "no-cache",
    ...(isGet && !rest.body ? {} : { "Content-Type": "application/json" }),
  };

  let res;
  try {
    res = await fetch(url.toString(), {
      method: isGet ? "GET" : rest.method,
      cache: "no-store",              // ← hard-disable browser caching
      credentials: "include",
      headers: {
        ...baseHeaders,
        ...(rest.headers || {}),
      },
      ...rest,
    });
  } catch (e) {
    // Network or CORS error bubbles up as TypeError in fetch
    if (e.name === "TypeError") {
      throw new Error("Network error. Is the server running?");
    }
    throw e;
  }

  // Handle non-OK statuses
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  console.debug("[apiFetch]", res.status, res.url, res.headers.get("content-type"));

  // 204 or empty body: return null
  if (res.status === 204) return null;

  // Try to parse JSON, but tolerate empty body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


// AppsAPI
export const AppsAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/apps${q ? `?${q}` : ""}`, { cacheBust: true }); // ← important after mutations
  },
  create: (payload) =>
    apiFetch("/apps", { method: "POST", body: JSON.stringify(payload), cacheBust: true }),
  update: (id, payload) =>
    apiFetch(`/apps/${id}`, { method: "PUT", body: JSON.stringify(payload), cacheBust: true }),
  remove: (id) =>
    apiFetch(`/apps/${id}`, { method: "DELETE", cacheBust: true }),
};



