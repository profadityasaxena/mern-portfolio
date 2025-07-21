"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  targetUserId: string;
  action: string;
  details: Record<string, unknown>;
}

const ACTION_TYPES = [
  "UPDATE_ROLE",
  "DELETE_USER",
  "RESET_PASSWORD",
  "CREATE_USER",
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (actionFilter) query.set("action", actionFilter);

    fetch(`/api/admin/audit-logs?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching logs");
        return res.json();
      })
      .then((data: { logs: AuditLog[]; total: number }) => {
        setLogs(data.logs);
        setTotal(data.total);
      })
      .catch(() => setError("Access denied or failed to load audit logs."));
  }, [page, limit, actionFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <select
          className="border px-2 py-1 text-sm"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1); // Reset page on filter change
          }}
        >
          <option value="">All Actions</option>
          {ACTION_TYPES.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left py-2 px-3">Timestamp</th>
            <th className="text-left py-2 px-3">Action</th>
            <th className="text-left py-2 px-3">Actor ID</th>
            <th className="text-left py-2 px-3">Target User ID</th>
            <th className="text-left py-2 px-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No audit logs found.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-2 px-3 font-medium">{log.action}</td>
                <td className="py-2 px-3 text-xs text-gray-700">
                  {log.actorId}
                </td>
                <td className="py-2 px-3 text-xs text-gray-700">
                  {log.targetUserId}
                </td>
                <td className="py-2 px-3 text-xs">
                  <pre className="whitespace-pre-wrap break-words">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
