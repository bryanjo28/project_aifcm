"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminMainLayout from "@/app/components/layout/AdminMainLayout";
import { getCsrfToken } from "@/lib/csrf";
import type { Product } from "../types";

type ProductDetailResponse = {
  ok: boolean;
  data?: Product;
  message?: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

        const meResponse = await fetch(`${apiBaseUrl}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const meResult = (await meResponse.json()) as { ok: boolean; data?: AuthUser };
        if (!meResponse.ok || !meResult.data || meResult.data.role !== "admin") {
          throw new Error("Unauthorized");
        }

        setUser(meResult.data);
        setCheckingAuth(false);

        const id = Number(params.id);
        if (!Number.isFinite(id) || id <= 0) {
          throw new Error("ID produk tidak valid.");
        }

        const productResponse = await fetch(`${apiBaseUrl}/api/v1/products/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const productResult = (await productResponse.json()) as ProductDetailResponse;
        if (!productResponse.ok || !productResult.data) {
          throw new Error(productResult.message ?? "Produk tidak ditemukan.");
        }

        setProduct(productResult.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat detail produk.";
        toast.error(message);
        router.replace("/admin?tab=products");
      } finally {
        setLoadingProduct(false);
      }
    };

    void init();
  }, [params.id, router]);

  const handleLogout = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

      await fetch(`${apiBaseUrl}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
      });
    } finally {
      toast.success("Kamu sudah logout.");
      router.push("/login");
    }
  };

  if (checkingAuth || loadingProduct) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/70">Memuat detail produk...</p>
      </main>
    );
  }

  if (!product || !user) {
    return null;
  }

  return (
    <AdminMainLayout
      activeTab="products"
      user={user}
      onLogout={handleLogout}
      hideTopToolbar
      primaryAction={{ label: "+ Add New", onClick: () => {}, hidden: true }}
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push("/admin?tab=products")}
          className="inline-flex rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:border-[rgba(30,174,219,0.45)] hover:text-white"
        >
          Back
        </button>

        <h2 className="text-3xl font-semibold text-white">{product.title}</h2>
        <p className="text-sm text-white/65">
          Halaman detail masih sederhana. Product title sudah dibawa dari list berdasarkan ID.
        </p>
      </div>
    </AdminMainLayout>
  );
}
