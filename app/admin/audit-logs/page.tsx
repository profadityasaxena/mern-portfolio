"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (actionFilter !== "all") query.set("action", actionFilter);

    fetch(`/api/admin/audit-logs?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching logs");
        return res.json();
      })
      .then((data: { logs: AuditLog[]; total: number }) => {
        setLogs(data.logs);
        setTotal(data.total);
      })
      .catch(() =>
        setError("Access denied or failed to load audit logs.")
      );
  }, [page, limit, actionFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="max-w-6xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-2xl">Audit Logs</CardTitle>

          <Select
            value={actionFilter}
            onValueChange={(value) => {
              setActionFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {ACTION_TYPES.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-destructive mb-4 text-sm">{error}</p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor ID</TableHead>
                <TableHead>Target User ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.action}
                    </TableCell>
                    <TableCell className="text-xs">{log.actorId}</TableCell>
                    <TableCell className="text-xs">
                      {log.targetUserId}
                    </TableCell>
                    <TableCell className="text-xs whitespace-pre-wrap break-words">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
