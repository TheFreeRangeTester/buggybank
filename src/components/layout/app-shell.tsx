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
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">BuggyBank</p>
            <p className="text-xs text-slate-500">Sandbox bancario para testing manual y automation</p>
          </div>
          <div className="flex items-center gap-3">
            {enabled ? (
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
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
            <p className="text-sm text-slate-600">{userName}</p>
            <Button onClick={logout} variant="secondary">
              Salir
            </Button>
          </div>
        </div>
      </header>
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-5",
          active ? "md:grid-cols-[210px_1fr_260px]" : "md:grid-cols-[210px_1fr]"
        )}
      >
        <aside className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">Navegación</p>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100",
                  pathname === item.href && "bg-brand-50 font-medium text-brand-700"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {enabled && active ? (
            <p className="mt-3 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
              QA Mode activo: las pistas aparecen de forma gradual.
            </p>
          ) : null}
        </aside>
        <main className="space-y-4">{children}</main>
        <QaSystemPanel pathname={pathname} />
      </div>
    </div>
  );
};
