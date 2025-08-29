"use client";

import { useState } from "react";

export default function UserSearch({ onSearch, onRoleFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    onRoleFilter(role);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by username, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex gap-2">
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>

        {(searchTerm || selectedRole) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRole("");
              onSearch("");
              onRoleFilter("");
            }}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
