interface Props {
  onLogout: () => void;
}

export default function DashboardSidebar({ onLogout }: Props) {
  return (
    <aside className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">
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

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 w-full rounded-xl border border-white/15 bg-[rgba(8,16,34,0.75)] px-4 py-3 text-sm font-semibold text-white/88 transition hover:border-[rgba(30,174,219,0.45)] hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}
