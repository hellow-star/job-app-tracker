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
        const data = await AppsAPI.list({ ...params, _t: Date.now() }); // cache-bust
        setApps(Array.isArray(data) ? [...data] : []);                  // new array ref
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

  // inside useApps
    const createApp = async (payload) => {
    // 1) optimistic add
    const tmpId = `tmp-${Date.now()}`;
    const optimistic = { id: tmpId, ...payload, createdAt: new Date().toISOString() };
    setApps(prev => [...prev, optimistic]);

    try {
        const created = await AppsAPI.create(payload); // should return the new object
        // 2) replace optimistic with server record
        setApps(prev => prev.map(a => (a.id === tmpId ? created : a)));
        await refresh({ bustCache: true }); // refresh to ensure server truth
        return created;
    } catch (e) {
        // rollback if failed
        setApps(prev => prev.filter(a => a.id !== tmpId));
        throw e;
    }

    // 3) final refresh to be safe (in case server adds computed fields)
    await refresh({ bustCache: true });
    };

    const updateApp = async (id, patch) => {
    setApps(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
    try {
        await AppsAPI.update(id, patch);
        await refresh({ bustCache: true });
    } catch (e) {
        await refresh({ bustCache: true }); // rollback to server truth
        throw e;
    }
    };

    const deleteApp = async (id) => {
    const keep = (prev) => prev.filter(a => a.id !== id);
    const snapshot = apps;
    setApps(keep);
    try {
        await AppsAPI.remove(id);
        await refresh({ bustCache: true });
    } catch (e) {
        setApps(snapshot); // rollback on failure
        throw e;
    }
    };


  return {
    apps, loading, error,
    q, setQ, status, setStatus,
    refresh, createApp, updateApp, deleteApp
  };
}
