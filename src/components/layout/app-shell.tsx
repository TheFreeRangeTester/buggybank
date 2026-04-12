"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { useQaMode } from "@/components/qa/qa-provider";
import { QaSystemPanel } from "@/components/qa/qa-system-panel";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type AppShellProps = {
  userName: string;
  children: ReactNode;
};

export const AppShell = ({ userName, children }: AppShellProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { enabled, active, setActive } = useQaMode();

  const logout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">BB</div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">BuggyBank</p>
              <p className="text-xs text-slate-500">Sandbox bancario para testing manual y automation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {enabled ? (
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
                <input
                  checked={active}
                  onChange={(event) => {
                    setActive(event.target.checked);
                  }}
                  type="checkbox"
                />
                QA Mode
              </label>
            ) : null}
            <p className="hidden text-sm text-slate-600 md:block">{userName}</p>
            <Button onClick={logout} variant="secondary">
              Salir
            </Button>
          </div>
        </div>
      </header>
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-5",
          active ? "md:grid-cols-[220px_1fr_270px]" : "md:grid-cols-[220px_1fr]"
        )}
      >
        <aside className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-card">
          <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">Navegación</p>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100",
                  pathname === item.href && "bg-brand-50 font-medium text-brand-700 ring-1 ring-brand-100"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {enabled && active ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <p className="font-medium">QA Mode activo</p>
              <p className="mt-1">Las pistas aparecen de forma gradual y contextual.</p>
            </div>
          ) : null}
        </aside>
        <main className="space-y-4">{children}</main>
        <QaSystemPanel pathname={pathname} />
      </div>
    </div>
  );
};
