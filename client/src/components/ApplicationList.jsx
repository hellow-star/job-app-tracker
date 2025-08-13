import { useState } from "react";
import ApplicationForm from "./ApplicationForm";

// Optional: if you created StatusBadge & Button components in Day 5, import them.
//import StatusBadge from "./StatusBadge";
import Button from "./ui/Button";

function StatusBadge({ status }) {
  const colors = {
    applied: "bg-gray-100 text-gray-700",
    interview: "bg-yellow-100 text-yellow-700",
    offer: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function ApplicationList({ apps, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!apps?.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
        No applications yet. Click <span className="font-semibold">“New Application”</span> to add your first one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile cards (below md) */}
      <div className="block md:hidden space-y-3">
        {apps.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded-xl shadow">
            {editingId === app._id ? (
              <ApplicationForm
                initial={app}
                onCancel={() => setEditingId(null)}
                onSubmit={(payload) => onUpdate(app._id, payload)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold">
                    {app.company} — {app.role}
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                  {app.location && <span>{app.location}</span>}
                  {app.link && (
                    <a
                      className="text-blue-600 underline"
                      href={app.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      job link
                    </a>
                  )}
                  {app.dateApplied && <span>{formatDate(app.dateApplied)}</span>}
                </div>

                {app.notes && <p className="text-sm text-gray-700">{app.notes}</p>}

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingId(app._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (confirm("Delete this application?")) onDelete(app._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table (md and up) */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50 text-left">
            <tr className="text-sm text-gray-600">
              <th className="px-4 py-3 w-[22%]">Company</th>
              <th className="px-4 py-3 w-[22%]">Role</th>
              <th className="px-4 py-3 w-[16%]">Status</th>
              <th className="px-4 py-3 w-[16%]">Date</th>
              <th className="px-4 py-3 w-[14%]">Location</th>
              <th className="px-4 py-3 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {apps.map((app) => (
              <tr key={app._id} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{app.company}</div>
                  {app.link && (
                    <a
                      className="text-xs text-blue-600 underline"
                      href={app.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      job link
                    </a>
                  )}
                </td>
                <td className="px-4 py-3">{app.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3">{app.dateApplied ? formatDate(app.dateApplied) : ""}</td>
                <td className="px-4 py-3">{app.location || ""}</td>
                <td className="px-4 py-3">
                  {editingId === app._id ? (
                    <div className="max-w-lg">
                      <ApplicationForm
                        initial={app}
                        onCancel={() => setEditingId(null)}
                        onSubmit={(payload) => onUpdate(app._id, payload)}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(app._id)}
                        className="px-3 py-2 rounded border"
                        aria-label={`Edit ${app.company} ${app.role}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this application?")) onDelete(app._id);
                        }}
                        className="px-3 py-2 rounded bg-red-600 text-white"
                        aria-label={`Delete ${app.company} ${app.role}`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
