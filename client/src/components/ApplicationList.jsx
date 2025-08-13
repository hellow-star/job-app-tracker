import { useState } from "react";
import ApplicationForm from "./ApplicationForm";

function StatusBadge({ s }) {
  const cls =
    s === "offer" ? "bg-green-100 text-green-700" :
    s === "interview" ? "bg-yellow-100 text-yellow-700" :
    s === "rejected" ? "bg-red-100 text-red-700" :
    "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{s}</span>;
}

export default function ApplicationList({ apps, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!apps.length) {
    return <p className="text-gray-500">No applications yet. Add your first one!</p>;
  }

  return (
    <div className="space-y-3">
      {apps.map(app =>
        <div key={app._id} className="bg-white p-4 rounded-xl shadow">
          {editingId === app._id ? (
            <ApplicationForm
              initial={app}
              onCancel={() => setEditingId(null)}
              onSubmit={(payload) => onUpdate(app._id, payload)}
            />
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold">{app.company} — {app.role}</div>
                <div className="text-sm text-gray-600 flex gap-2 mt-1">
                  <StatusBadge s={app.status} />
                  {app.location && <span>{app.location}</span>}
                  {app.link && <a className="text-blue-600 underline" href={app.link} target="_blank">job link</a>}
                  {app.dateApplied && <span>{new Date(app.dateApplied).toLocaleDateString()}</span>}
                </div>
                {app.notes && <p className="text-sm text-gray-700 mt-2">{app.notes}</p>}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditingId(app._id)} className="px-3 py-2 rounded border">Edit</button>
                <button
                  onClick={() => {
                    if (confirm("Delete this application?")) onDelete(app._id);
                  }}
                  className="px-3 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
