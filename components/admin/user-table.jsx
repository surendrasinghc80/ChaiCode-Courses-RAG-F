"use client";

import { EyeIcon, BanIcon, CheckCircleIcon, RotateIcon } from "./icons";

export default function UserTable({
  users,
  onViewDetails,
  onToggleActive,
  onResetMessages,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Age</Th>
            <Th>City</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Conversations</Th>
            <Th>Messages</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id} className="bg-background">
              <Td className="font-medium">{u.username}</Td>
              <Td className="text-muted-foreground">{u.email}</Td>
              <Td>{u.age}</Td>
              <Td>{u.city}</Td>
              <Td className="capitalize">{u.role}</Td>
              <Td>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                  ${
                    u.isActive
                      ? "bg-blue-600/10 text-blue-700 dark:text-blue-400"
                      : "bg-red-600/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  {u.isActive ? "Active" : "Blocked"}
                </span>
              </Td>
              <Td>{u.conversationCount}</Td>
              <Td>{u.messageCount}</Td>
              <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(u.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                    aria-label="View details"
                  >
                    <EyeIcon />
                    <span className="hidden md:inline">View</span>
                  </button>
                  <button
                    onClick={() => onToggleActive(u)}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                    aria-label={u.isActive ? "Block user" : "Unblock user"}
                  >
                    {u.isActive ? (
                      <BanIcon className="text-red-600" />
                    ) : (
                      <CheckCircleIcon className="text-blue-600" />
                    )}
                    <span className="hidden md:inline">
                      {u.isActive ? "Block" : "Unblock"}
                    </span>
                  </button>
                  <button
                    onClick={() => onResetMessages(u)}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                    aria-label="Reset message count"
                  >
                    <RotateIcon className="text-foreground" />
                    <span className="hidden md:inline">Reset</span>
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return (
    <th
      scope="col"
      className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide"
    >
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-3 align-middle ${className}`}>{children}</td>;
}
