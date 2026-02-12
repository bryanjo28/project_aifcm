interface Props {
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

export default function DashboardSidebar({ onLogout, user }: Props) {
  return (
    <aside className="flex h-full flex-col border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">
      <p className="text-xs font-semibold tracking-[0.22em] text-white/45">
        MENU
      </p>
      <nav className="mt-4 space-y-2.5">
        <button className="w-full rounded-xl border border-[rgba(30,174,219,0.5)] bg-[rgba(30,174,219,0.15)] px-4 py-3 text-left text-sm font-semibold text-white">
          Dashboard
        </button>
        <button className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.55)] px-4 py-3 text-left text-sm text-white/78">
          My Course
        </button>
        <button className="w-full rounded-xl border border-white/10 bg-[rgba(8,16,34,0.55)] px-4 py-3 text-left text-sm text-white/78">
          Notifikasi
        </button>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-[rgba(30,174,219,0.32)] bg-[rgba(8,16,34,0.65)] p-4">
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--glow-light)]">
            {user.role}
          </p>
          <p className="mt-2 text-xs text-white/60">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-white/15 bg-[rgba(8,16,34,0.75)] px-4 py-3 text-sm font-semibold text-white/88 transition hover:border-[rgba(30,174,219,0.45)] hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
