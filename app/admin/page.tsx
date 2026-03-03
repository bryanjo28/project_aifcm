"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/csrf";
import AdminMainLayout, {
  adminSidebarItems,
} from "@/app/components/layout/AdminMainLayout";
import type { AdminTab } from "@/app/components/layout/AdminSidebar";

import { useProducts } from "./products/useProducts";
import ProductListTable from "./products/ProductListTable";
import ProductFormModal from "./products/ProductFormModal";
import { useUsers } from "./users/useUsers";
import UserListTable from "./users/UserListTable";
import type { Product } from "./products/types"; // ✅ kalau belum ada

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [productPage, setProductPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- determine active tab ---
  const allowedTabs = adminSidebarItems.map((item) => item.key);
  const tabFromQuery = searchParams.get("tab");
  const activeTab: AdminTab =
    tabFromQuery && allowedTabs.includes(tabFromQuery as AdminTab)
      ? (tabFromQuery as AdminTab)
      : "overview";

  // --- auth check ---
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BYPASS_DASHBOARD_AUTH === "true") {
      setUser({
        id: "dev-admin",
        name: "Dev Admin",
        email: "admin@local",
        role: "admin",
        isActive: true,
      });
      setCheckingAuth(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
          "http://localhost:4000";

        const response = await fetch(`${apiBaseUrl}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const result = (await response.json()) as {
          ok: boolean;
          data?: AuthUser;
        };

        if (!response.ok || !result.data)
          throw new Error("Silakan login dulu.");

        if (result.data.role !== "admin") {
          toast.error("Halaman ini hanya untuk admin.");
          router.replace("/user");
          return;
        }

        setUser(result.data);
      } catch {
        toast.error("Silakan login dulu.");
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    void checkAuth();
  }, [router]);

  // Fetch products only after auth success and only when products tab is active.
  const shouldFetchProducts =
    !!user && !checkingAuth && activeTab === "products";
  const shouldFetchUsers = !!user && !checkingAuth && activeTab === "users";

  const {
    data: products,
    pagination,
    loading: productsLoading,
    refetch: refetchProducts,
  } = useProducts({
    page: productPage,
    limit: 10,
    enabled: shouldFetchProducts,
  });

  const {
    data: users,
    pagination: usersPagination,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useUsers({
    page: userPage,
    limit: 10,
    enabled: shouldFetchUsers,
  });

  //delete product
  const handleDeleteProduct = useCallback(async (product: Product) => {
    const confirmed = window.confirm(
      `Yakin mau hapus produk "${product.title}"?`,
    );
    if (!confirmed) return;

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

      const res = await fetch(`${apiBaseUrl}/api/v1/products/${product.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
      });

      const json = (await res.json()) as { ok: boolean; message?: string };

      if (!res.ok || !json.ok) {
        toast.error(json?.message ?? "Gagal menghapus produk.");
        return;
      }

      toast.success("Produk berhasil dihapus.");

      // optional: kalau delete bikin page kosong, balik ke page sebelumnya
      if (
        pagination &&
        pagination.totalPages > 1 &&
        products.length === 1 &&
        productPage > 1
      ) {
        setProductPage((prev) => prev - 1);
      }

      await refetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi error saat menghapus produk.");
    }
  }, [pagination, productPage, products.length, refetchProducts]);

  // --- logout ---
  const handleLogout = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

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

  // --- tab content ---
  const tabContent = useMemo(() => {
    if (activeTab === "products") {
      return (
        <ProductListTable
          data={products}
          loading={productsLoading}
          pagination={pagination}
          onPrev={() => setProductPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setProductPage((prev) =>
              prev < Math.max(pagination.totalPages, 1) ? prev + 1 : prev,
            )
          }
          onRefresh={refetchProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setOpenCreate(true);
          }}
          onDelete={handleDeleteProduct}
          onOpen={(product) => router.push(`/admin/products/${product.id}`)}
        />
      );
    }

    if (activeTab === "users") {
      return (
        <UserListTable
          data={users}
          loading={usersLoading}
          pagination={usersPagination}
          onPrev={() => setUserPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setUserPage((prev) =>
              prev < Math.max(usersPagination.totalPages, 1) ? prev + 1 : prev,
            )
          }
          onRefresh={refetchUsers}
        />
      );
    }

    // fallback tab lain masih dummy dulu
    return (
      <p className="mt-4 text-sm text-white/65">
        Konten untuk tab{" "}
        <span className="font-semibold text-white/80">{activeTab}</span> belum
        dibuat.
      </p>
    );
  }, [
    activeTab,
    handleDeleteProduct,
    pagination,
    products,
    productsLoading,
    refetchProducts,
    router,
    users,
    usersLoading,
    usersPagination,
    refetchUsers,
  ]);

  // --- guards ---
  if (checkingAuth) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/70">Memeriksa sesi login...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <>
      <AdminMainLayout
        activeTab={activeTab}
        user={user}
        onLogout={handleLogout}
        primaryAction={
          activeTab === "products"
            ? {
                label: "+ Add New",
                onClick: () => {
                  setEditingProduct(null);
                  setOpenCreate(true);
                },
              }
            : undefined
        }
      >
        {tabContent}
      </AdminMainLayout>

      <ProductFormModal
        open={openCreate}
        product={editingProduct}
        onClose={() => {
          setOpenCreate(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          setProductPage(1);
          void refetchProducts();
          setEditingProduct(null);
        }}
      />
    </>
  );
}
