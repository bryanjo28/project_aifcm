"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/csrf";
import type { Product } from "./types";

type CreateProductPayload = {
  title: string;
  slug: string;
  short_description?: string;
  price: number;
  status?: "draft" | "active" | "inactive";
};

type CreateProductResponse =
  | { ok: true; data: { id: number } }
  | { ok: false; message?: string };
type UpdateProductResponse = { ok: boolean; message?: string };

type ProductStatus = "draft" | "active" | "inactive";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductFormModal({
  open,
  onClose,
  onSuccess,
  product,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: Product | null;
}) {
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const isEditMode = Boolean(product);

  const generatedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (!open) return;

    if (product) {
      setTitle(product.title ?? "");
      setSlug(product.slug ?? "");
      setShortDescription(product.short_description ?? "");
      setPrice(String(product.price ?? "0"));
      setStatus(product.status ?? "draft");
      return;
    }

    setTitle("");
    setSlug("");
    setShortDescription("");
    setPrice("0");
    setStatus("draft");
  }, [open, product]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setShortDescription("");
    setPrice("0");
    setStatus("draft");
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const finalSlug = (slug || generatedSlug).trim();

    if (!title.trim()) {
      toast.error("Title wajib diisi.");
      return;
    }
    if (!finalSlug) {
      toast.error("Slug wajib diisi.");
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      toast.error("Price harus angka >= 0.");
      return;
    }

    const payload: CreateProductPayload = {
      title: title.trim(),
      slug: finalSlug,
      short_description: shortDescription.trim() ? shortDescription.trim() : undefined,
      price: numericPrice,
      status,
    };

    setSubmitting(true);
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

      const endpoint = isEditMode
        ? `${apiBaseUrl}/api/v1/products/${product?.id}`
        : `${apiBaseUrl}/api/v1/products`;

      const res = await fetch(endpoint, {
        method: isEditMode ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as CreateProductResponse | UpdateProductResponse;

      if (!res.ok || !json.ok) {
        toast.error(json && "message" in json && json.message ? json.message : "Gagal membuat produk.");
        return;
      }

      toast.success(isEditMode ? "Produk berhasil diupdate." : "Produk berhasil dibuat.");
      onSuccess?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(isEditMode ? "Terjadi error saat update product." : "Terjadi error saat create product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[rgba(6,14,32,0.96)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-white/45">PRODUCTS</p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="mt-1 text-sm text-white/60">Isi data inti produk dulu, detail bisa menyusul.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:border-white/20 disabled:opacity-40"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: AI Faceless Content Mastery"
                className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.65)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[rgba(30,174,219,0.55)]"
              />
            </label>

            <label className="grid gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Slug</span>
                <button
                  type="button"
                  onClick={() => setSlug(generatedSlug)}
                  className="text-xs font-semibold text-[var(--glow-light)] hover:brightness-110"
                >
                  Use auto-slug
                </button>
              </div>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={generatedSlug || "contoh-slug-produk"}
                className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.65)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[rgba(30,174,219,0.55)]"
              />
              <p className="text-[11px] text-white/40">
                URL akan jadi: <span className="text-white/55">/products/{slug || generatedSlug || "..."}</span>
              </p>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-white/60">Short description</span>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ringkasan singkat untuk list."
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-[rgba(8,16,34,0.65)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[rgba(30,174,219,0.55)]"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs text-white/60">Price (IDR)</span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.65)] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[rgba(30,174,219,0.55)]"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-white/60">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.65)] px-4 py-3 text-sm text-white outline-none focus:border-[rgba(30,174,219,0.55)]"
                >
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/80 hover:border-white/20 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(30,174,219,0.22)] transition hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
