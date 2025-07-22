"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const ROLE_OPTIONS = [
  "user",
  "admin",
  "employee",
  "vendor",
  "partner",
  "client",
];

export default function AdminUserPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    userId: string;
    newRole: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data: { users: User[] }) => setUsers(data.users))
      .catch(() => setError("Access denied or failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmedRoleChange = async (
    userId: string,
    newRole: string
  ) => {
    const previousUsers = [...users];
    setUsers((curr) =>
      curr.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setUpdatingId(userId);

    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        setUsers(previousUsers);
        alert(data.error || "Failed to update role.");
      }
    } catch {
      setUsers(previousUsers);
      alert("Network error occurred while updating role.");
    } finally {
      setUpdatingId(null);
      setConfirmModal(null);
    }
  };

  const handleRoleChange = (user: User, newRole: string) => {
    const isDemotion = user.role === "admin" && newRole !== "admin";
    if (isDemotion) {
      setConfirmModal({ userId: user.id, newRole });
    } else {
      handleConfirmedRoleChange(user.id, newRole);
    }
  };

  return (
    <main className="max-w-5xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-destructive text-sm mb-4">{error}</p>
          )}

          {loading ? (
            <Skeleton className="h-48 w-full rounded" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-6"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const isSelf = session?.user?.id === user.id;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            disabled={isSelf || updatingId === user.id}
                            onValueChange={(value) =>
                              handleRoleChange(user, value)
                            }
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() +
                                    role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isSelf && (
                            <p className="text-xs text-muted-foreground mt-1">
                              You cannot change your own role
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {confirmModal && (
        <ConfirmModal
          title="Confirm Role Change"
          message="Are you sure you want to demote this admin? This may restrict their access."
          onCancel={() => setConfirmModal(null)}
          onConfirm={() =>
            handleConfirmedRoleChange(
              confirmModal.userId,
              confirmModal.newRole
            )
          }
        />
      )}
    </main>
  );
}
