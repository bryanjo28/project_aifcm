"use client";

import type { Pagination, Product } from "./types";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  data: Product[];
  loading: boolean;
  pagination: Pagination;
  onPrev?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;

  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onOpen?: (product: Product) => void;
};

export default function ProductListTable({
  data,
  loading,
  pagination,
  onPrev,
  onNext,
  onRefresh,
  onEdit,
  onDelete,
  onOpen,
}: Props) {
  if (loading) return <p className="text-white/60 mt-4">Loading products...</p>;

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
        <p className="text-white/60 mt-4">No products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="text-white/50 border-b border-white/10">
              <tr>
                <th className="py-3">Thumbnail</th>
                <th className="py-3">Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Views</th>
                <th>Sales</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((p) => {
                const statusStyle =
                  p.status === "active"
                    ? "bg-green-500/15 text-green-300 border-green-500/30"
                    : p.status === "draft"
                      ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
                      : "bg-red-500/15 text-red-300 border-red-500/30";

                return (
                  <tr
                    key={p.id}
                    className="cursor-pointer border-b border-white/5 transition hover:bg-white/5"
                    onClick={() => onOpen?.(p)}
                  >
                    <td className="py-3">
                      {p.thumbnail_url ? (
                        <img
                          src={p.thumbnail_url}
                          alt={p.title}
                          className="h-14 w-20 rounded-lg border border-white/10 bg-white/5 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5 text-[11px] text-white/40">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-medium underline-offset-2 hover:underline">
                      {p.title}
                    </td>
                    <td>{p.category_names?.[0] ?? "-"}</td>
                    <td>
                      {Number(p.price).toLocaleString("id-ID")} {p.currency}
                    </td>
                    <td>{p.total_views ?? 0}</td>
                    <td>{p.total_sales ?? 0}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs capitalize ${statusStyle}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit?.(p);
                          }}
                          className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:border-[rgba(30,174,219,0.5)] hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete?.(p);
                          }}
                          className="rounded-lg border border-white/10 p-2 text-red-300 transition hover:border-red-400/50 hover:text-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
