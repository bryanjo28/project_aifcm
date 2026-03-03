"use client";

import { useCallback, useEffect, useState } from "react";
import type { Pagination, UserItem, UsersResponse } from "./types";

type UseUsersOptions = {
  enabled: boolean;
  page: number;
  limit?: number;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

const normalizeUsers = (raw: unknown): UserItem[] => {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      id: (row.id as string | number | undefined) ?? "",
      name: (row.name as string | undefined) ?? "-",
      email: (row.email as string | undefined) ?? "-",
      role: ((row.role as string | undefined) ?? "user") as UserItem["role"],
      isActive: Boolean(row.isActive ?? row.is_active ?? true),
      createdAt: (row.createdAt as string | undefined) ?? (row.created_at as string | undefined) ?? null,
      updatedAt: (row.updatedAt as string | undefined) ?? (row.updated_at as string | undefined) ?? null,
    };
  });
};

const safeNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const useUsers = ({ enabled, page, limit = 10 }: UseUsersOptions) => {
  const [items, setItems] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      const requestInit: RequestInit = {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      };
      const apiBase = getApiBaseUrl();
      // const usersPath = `/api/v1/users?page=${page}&limit=${limit}`;
      const userPath = `/api/v1/user?page=${page}&limit=${limit}`;

      let res = await fetch(`${apiBase}${userPath}`, requestInit);

      const json = (await res.json()) as UsersResponse;
      const data = (json.data ?? {}) as Record<string, unknown>;

      const normalizedUsers = normalizeUsers(data.items ?? data.users ?? json.data);
      const rawPagination = (data.pagination ?? {}) as Record<string, unknown>;

      const nextPage = safeNumber(rawPagination.page, page);
      const nextLimit = safeNumber(rawPagination.limit, limit);
      const nextTotal = safeNumber(rawPagination.total, normalizedUsers.length);
      const nextTotalPages =
        safeNumber(rawPagination.totalPages, 0) ||
        (nextLimit > 0 ? Math.ceil(nextTotal / nextLimit) : 0);

      setItems(normalizedUsers);
      setPagination({
        page: nextPage,
        limit: nextLimit,
        total: nextTotal,
        totalPages: nextTotalPages,
      });
    } catch (err) {
      console.error(err);
      setItems([]);
      setPagination({
        page,
        limit,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [enabled, page, limit]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    void fetchUsers();
  }, [enabled, fetchUsers]);

  return {
    items,
    data: items,
    loading,
    pagination,
    refetch: fetchUsers,
  };
};
