const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });
    if (!res.ok) {
      let msg = `Error ${res.status}`;
      try { const data = await res.json(); if (data?.error) msg = data.error; } catch {}
      const err = new Error(msg); err.status = res.status; throw err;
    }
    return res.json();
  } catch (e) {
    if (e.name === "TypeError") { // network error
      throw new Error("Network error. Is the server running?");
    }
    throw e;
  }
}

export const AppsAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/apps${q ? `?${q}` : ""}`);
  },
  create: (payload) =>
    apiFetch("/apps", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiFetch(`/apps/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => apiFetch(`/apps/${id}`, { method: "DELETE" }),
};
