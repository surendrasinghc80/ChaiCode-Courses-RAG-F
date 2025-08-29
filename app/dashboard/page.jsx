"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StatsCard from "../../components/admin/stats-card";
import UserTable from "../../components/admin/user-table";
import UserDetailsModal from "../../components/admin/user-details-modal";
import DashboardNav from "../../components/admin/dashboard-nav";
import UserSearch from "../../components/admin/user-search";
import {
  getAllUsers,
  getPlatformStats,
  toggleUserAccess,
  resetUserMessageCount,
} from "../../lib/api";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [usersData, setUsersData] = useState({ users: [], pagination: null });
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const response = await getPlatformStats();
        if (!cancelled && response.success) {
          setStats(response.data);
        }
      } catch (e) {
        if (!cancelled) setStatsError(e.message || "Error loading stats");
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }
    if (session?.user?.role === "admin") {
      loadStats();
    }
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await getAllUsers({
          page,
          limit: 10,
          search: searchTerm,
          role: roleFilter,
        });
        if (!cancelled && response.success) {
          setUsersData(response.data);
        }
      } catch (e) {
        if (!cancelled) setUsersError(e.message || "Error loading users");
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }
    if (session?.user?.role === "admin") {
      loadUsers();
    }
    return () => {
      cancelled = true;
    };
  }, [page, searchTerm, roleFilter, session]);

  function handleOpenDetails(userId) {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  }

  async function handleToggleActive(user) {
    try {
      const response = await toggleUserAccess(user.id, !user.isActive);
      if (response.success) {
        setUsersData((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u.id === user.id ? { ...u, isActive: response.data.isActive } : u
          ),
        }));
        refreshStats();
      }
    } catch (e) {
      alert(e.message || "Error performing action");
    }
  }

  async function handleResetMessages(user) {
    try {
      const response = await resetUserMessageCount(user.id);
      if (response.success) {
        setUsersData((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u.id === user.id
              ? { ...u, messageCount: response.data.messageCount }
              : u
          ),
        }));
        refreshStats();
      }
    } catch (e) {
      alert(e.message || "Error performing action");
    }
  }

  async function refreshStats() {
    try {
      const response = await getPlatformStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch {}
  }

  function handleSearch(search) {
    setSearchTerm(search);
    setPage(1); // Reset to first page when searching
  }

  function handleRoleFilter(role) {
    setRoleFilter(role);
    setPage(1); // Reset to first page when filtering
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  const pagination = usersData?.pagination;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <section className="mx-auto max-w-6xl px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {statsLoading && (
            <>
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
            </>
          )}
          {statsError && (
            <div className="col-span-full text-red-600 dark:text-red-500">
              Failed to load stats: {statsError}
            </div>
          )}
          {stats && !statsError && (
            <>
              <StatsCard title="Total Users" value={stats.users.total} />
              <StatsCard title="Active Users" value={stats.users.active} />
              <StatsCard title="Blocked Users" value={stats.users.blocked} />
              <StatsCard title="Admins" value={stats.users.admins} />
              <StatsCard title="Regular Users" value={stats.users.regular} />
              <StatsCard
                title="Conversations"
                value={stats.conversations.total}
                subtext={`${stats.conversations.active} active`}
              />
              <StatsCard
                title="Messages"
                value={stats.messages.total}
                subtext={`user ${stats.messages.user} • assistant ${stats.messages.assistant}`}
              />
              <StatsCard
                title="Recent Registrations"
                value={stats.users.recentRegistrations}
                subtext="last 7 days"
              />
            </>
          )}
        </div>

        {/* User Management Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <UserSearch
              onSearch={handleSearch}
              onRoleFilter={handleRoleFilter}
            />
          </div>

          {usersLoading && (
            <div className="rounded-lg border border-border">
              <div className="h-12 bg-muted rounded-t-lg" />
              <div className="h-40 bg-muted animate-pulse rounded-b-lg" />
            </div>
          )}
          {usersError && (
            <div className="text-red-600 dark:text-red-500">
              Failed to load users: {usersError}
            </div>
          )}
          {!usersLoading && !usersError && (
            <UserTable
              users={usersData.users}
              onViewDetails={handleOpenDetails}
              onToggleActive={handleToggleActive}
              onResetMessages={handleResetMessages}
            />
          )}

          {/* Pagination */}
          {pagination && (
            <div className="mt-4 flex items-center justify-between">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                ‹ Prev
              </button>
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages} •{" "}
                {pagination.totalUsers} users
              </div>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Drawer/Modal for User Details */}
      <UserDetailsModal
        isOpen={isModalOpen}
        userId={selectedUserId}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
