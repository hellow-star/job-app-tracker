import { useEffect, useMemo, useState } from "react";
import { AppsAPI } from "../api";

export default function useApps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(""); // "", "applied", "interview", "offer", "rejected"
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const p = {};
    if (q) p.q = q;
    if (status) p.status = status;
    return p;
  }, [q, status]);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AppsAPI.list(params);
      setApps(data);
    } catch (e) {
      setError(e.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  const createApp = async (payload) => {
    await AppsAPI.create(payload);
    await refresh();
  };
  const updateApp = async (id, payload) => {
    await AppsAPI.update(id, payload);
    await refresh();
  };
  const deleteApp = async (id) => {
    await AppsAPI.remove(id);
    await refresh();
  };

  return {
    apps, loading, error,
    q, setQ, status, setStatus,
    refresh, createApp, updateApp, deleteApp
  };
}
