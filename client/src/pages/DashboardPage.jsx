import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import useApps from "../hooks/useApps";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

// Optional: Heroicons (if installed). Fallback inline SVGs are provided below.
import {
  ArrowRightOnRectangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { createPortal } from "react-dom";

function Modal({ open, title, onClose, children }) {
  // Lock body scroll when open, and restore on close.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml || "";
      body.style.overflow = prevBody || "";
    };
  }, [open]);

  if (typeof window === "undefined" || !open) return null;


  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-root"
        className="fixed inset-0 z-[10000] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
      >
        {/* 背景遮罩 */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* 弹窗本体：强制居中、限定宽高、防溢出 */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          className="relative z-[10001] w-[min(720px,92vw)] max-h-[85vh] overflow-auto rounded-2xl bg-white p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()} // 避免点击内容触发关闭
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
            >
              Esc to close
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}



const STATUS = ["", "applied", "interview", "offer", "rejected"];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const {
    apps,
    loading,
    error,
    q,
    setQ,
    status,
    setStatus,
    createApp,
    updateApp,
    deleteApp,
  } = useApps();
  const [showCreate, setShowCreate] = useState(false);

  // Keyboard shortcut: “n” to open New Application
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "n" && !showCreate) setShowCreate(true);
      if (e.key === "Escape") setShowCreate(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCreate]);

  // Simple stats from your apps list
  const stats = useMemo(() => {
    const base = { total: apps?.length || 0, applied: 0, interview: 0, offer: 0, rejected: 0 };
    (apps || []).forEach((a) => {
      if (a?.status && base[a.status] !== undefined) base[a.status] += 1;
    });
    return base;
  }, [apps]);

  // Reusable small components
  const StatCard = ({ label, value, hint }) => (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="rounded-2xl border bg-white/80 backdrop-blur px-4 py-3 shadow-sm"
    >
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-xs text-gray-500">{hint}</div> : null}
    </motion.div>
  );

  const HeaderIconButton = ({ onClick, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2 text-sm shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-indigo-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <motion.h1
            layout
            className="text-lg font-bold tracking-tight"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Job Tracker
          </motion.h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:block">{user?.email}</span>
            <HeaderIconButton onClick={logout} title="Logout">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </HeaderIconButton>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Top row: Search/Filter + New */}
        <motion.section
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search + Filter */}
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-md">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl border bg-white/70 py-2 pl-10 pr-3 outline-none ring-0 transition focus:border-blue-500"
                  placeholder="Search company or role…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="relative sm:w-56">
                <FunnelIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full appearance-none rounded-xl border bg-white/70 py-2 pl-10 pr-9 outline-none transition focus:border-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s || "All statuses"}
                    </option>
                  ))}
                </select>
                {/* caret */}
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5" />
                New Application
              </button>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            layout
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
          >
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Applied" value={stats.applied} />
            <StatCard label="Interview" value={stats.interview} />
            <StatCard label="Offer" value={stats.offer} />
            <StatCard label="Rejected" value={stats.rejected} />
          </motion.div>
        </motion.section>

        {/* List / Loading / Error */}
        <section>
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-20 w-full animate-pulse rounded-2xl bg-gray-200/60"
                />
              ))}
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              {error}
            </motion.p>
          )}

          {!loading && !error && (
            <AnimatePresence mode="popLayout">
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ApplicationList apps={apps} onUpdate={updateApp} onDelete={deleteApp} />
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* Create Modal */}
      <Modal open={showCreate} title="New Application" onClose={() => setShowCreate(false)}>
        <ApplicationForm
          onCancel={() => setShowCreate(false)}
          onSubmit={async (data) => {
            const created = await createApp(data);
            const qLower = (q || "").toLowerCase();
            const matchesQ =
              !qLower ||
              created.company?.toLowerCase().includes(qLower) ||
              created.role?.toLowerCase().includes(qLower);
            const matchesStatus = !status || created.status === status;
            if (!matchesQ || !matchesStatus) {
              setQ("");
              setStatus("");
            }
            setShowCreate(false);
          }}
        />
      </Modal>


      {/* Floating New Button (mobile convenience) */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-1 ring-black/5 transition hover:brightness-110 md:hidden"
        aria-label="New Application (N)"
        title="New Application (N)"
      >
        <PlusIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
