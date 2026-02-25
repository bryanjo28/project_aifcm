"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserMainLayout from "@/app/components/layout/UserMainLayout";
import { getCsrfToken } from "@/lib/csrf";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BYPASS_DASHBOARD_AUTH === "true") {
      setUser({
        id: "dev-bypass",
        name: "Dev User",
        email: "dev@local",
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
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const result = (await response.json()) as { ok: boolean; data?: AuthUser };
        if (!response.ok || !result.data) {
          throw new Error("Silakan login dulu.");
        }

        if (result.data.role === "admin") {
          router.replace("/admin");
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

  if (checkingAuth) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/70">Memeriksa sesi login...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <UserMainLayout user={user} onLogout={handleLogout} />;
}
