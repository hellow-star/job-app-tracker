const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // important for cookies
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMessage = errData.error;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
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
