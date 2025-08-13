import { useEffect, useState } from "react";

const STATUS = ["applied", "interview", "offer", "rejected"];

export default function ApplicationForm({ initial = null, onCancel, onSubmit }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial) {
      setCompany(initial.company || "");
      setRole(initial.role || "");
      setLocation(initial.location || "");
      setLink(initial.link || "");
      setStatus(initial.status || "applied");
      setDateApplied(initial.dateApplied ? initial.dateApplied.slice(0,10) : "");
      setNotes(initial.notes || "");
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!company.trim() || !role.trim()) {
      setError("Company and Role are required.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        company, role, location, link, status,
        dateApplied: dateApplied || undefined,
        notes
      });
      onCancel?.(); // close form after success
    } catch (e) {
      setError(e.message || "Failed to save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="bg-white p-4 rounded-xl shadow space-y-3" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold">{initial ? "Edit Application" : "New Application"}</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Company *" value={company} onChange={e=>setCompany(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Role *" value={role} onChange={e=>setRole(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Job Link (URL)" value={link} onChange={e=>setLink(e.target.value)} />
        <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" value={dateApplied} onChange={e=>setDateApplied(e.target.value)} />
      </div>

      <textarea className="border p-2 rounded w-full" rows={3} placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />

      <div className="flex gap-2 justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>}
        <button disabled={busy} aria-busy={busy} className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2">
            {busy && <Spinner />} {initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
