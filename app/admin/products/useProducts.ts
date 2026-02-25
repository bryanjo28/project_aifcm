"use client";

import { useCallback, useEffect, useState } from "react";
import type { Pagination, Product, ProductsResponse } from "./types";

type UseProductsOptions = {
  enabled: boolean;
  page: number;
  limit?: number;
};

export const useProducts = ({ enabled, page, limit = 10 }: UseProductsOptions) => {
  const [items, setItems] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

      const res = await fetch(`${apiBaseUrl}/api/v1/products?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Fetch products failed (${res.status})`);

      const json = (await res.json()) as ProductsResponse;
      const next = json.data.pagination;

      setItems(json.data.items ?? []);
      setPagination({
        page: next.page,
        limit: next.limit,
        total: next.total,
        totalPages: next.limit > 0 ? Math.ceil(next.total / next.limit) : 0,
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
  }, [enabled, limit, page]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    void fetchProducts();
  }, [enabled, fetchProducts]);

  return { items, data: items, pagination, loading, refetch: fetchProducts };
};
