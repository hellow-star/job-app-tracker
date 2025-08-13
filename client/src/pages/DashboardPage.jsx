import { useState } from "react";
import { useAuth } from "../AuthContext";
import useApps from "../hooks/useApps";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

const STATUS = ["", "applied", "interview", "offer", "rejected"];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { apps, loading, error, q, setQ, status, setStatus, createApp, updateApp, deleteApp } = useApps();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Job Tracker</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={logout} className="px-3 py-2 rounded border">Logout</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Search + Filter + New */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2">
            <input
              className="border p-2 rounded w-64"
              placeholder="Search company or role…"
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
            <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
              {STATUS.map(s => <option key={s} value={s}>{s || "all statuses"}</option>)}
            </select>
          </div>
          <button onClick={()=>setShowCreate(v=>!v)} className="px-4 py-2 rounded bg-blue-600 text-white">
            {showCreate ? "Close" : "New Application"}
          </button>
        </div>

        {showCreate && (
          <ApplicationForm
            onCancel={()=>setShowCreate(false)}
            onSubmit={createApp}
          />
        )}

        {loading && <p>Loading applications…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <ApplicationList
            apps={apps}
            onUpdate={updateApp}
            onDelete={deleteApp}
          />
        )}
      </main>
    </div>
  );
}
