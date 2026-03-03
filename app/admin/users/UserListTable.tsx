"use client";

import type { Pagination, UserItem } from "./types";

type Props = {
  data: UserItem[];
  loading: boolean;
  pagination: Pagination;
  onPrev?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
};

export default function UserListTable({
  data,
  loading,
  pagination,
  onPrev,
  onNext,
  onRefresh,
}: Props) {
  if (loading) return <p className="mt-4 text-white/60">Loading users...</p>;

  const page = pagination.page;
  const totalPages = Math.max(pagination.totalPages, 1);
  const total = pagination.total;

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-white/70">
          Page {page} / {totalPages} | Total {total}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={!onRefresh}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/85 transition hover:border-[rgba(30,174,219,0.5)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev || page <= 1}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/85 transition hover:border-[rgba(30,174,219,0.5)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!onNext || page >= totalPages}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/85 transition hover:border-[rgba(30,174,219,0.5)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {!data.length ? (
        <p className="mt-4 text-white/60">No users.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="border-b border-white/10 text-white/50">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => {
                const statusStyle = u.isActive
                  ? "bg-green-500/15 text-green-300 border-green-500/30"
                  : "bg-red-500/15 text-red-300 border-red-500/30";

                return (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-3 font-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td className="capitalize">{u.role}</td>
                    <td>
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${statusStyle}`}>
                        {u.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
