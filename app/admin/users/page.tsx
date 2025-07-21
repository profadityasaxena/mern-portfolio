"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const ROLE_OPTIONS = ["user", "admin", "employee", "vendor", "partner", "client"];

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

  const handleConfirmedRoleChange = async (userId: string, newRole: string) => {
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
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left py-2 px-3">Email</th>
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelf = session?.user?.id === user.id;
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{user.email}</td>
                    <td className="py-2 px-3">{user.name}</td>
                    <td className="py-2 px-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={isSelf || updatingId === user.id}
                        className="border px-2 py-1 rounded"
                        aria-label={`Change role for ${user.email}`}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                      {isSelf && (
                        <p className="text-xs text-gray-400">
                          You cannot change your own role
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

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
