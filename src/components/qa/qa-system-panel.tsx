"use client";

import { useMemo } from "react";
import { useQaMode } from "@/components/qa/qa-provider";
import type { QaScope } from "@/data/qa-hints-catalog";

const scopeByPath = (pathname: string): QaScope => {
  if (pathname.startsWith("/transfers")) return "transfers";
  if (pathname.startsWith("/transactions")) return "transactions";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/login")) return "login";
  return "global";
};

type QaSystemPanelProps = {
  pathname: string;
};

export const QaSystemPanel = ({ pathname }: QaSystemPanelProps) => {
  const { active, panelOpen, togglePanel, getHints } = useQaMode();
  const scope = scopeByPath(pathname);

  const observations = useMemo(() => {
    return getHints(scope, "observation").slice(0, 5);
  }, [getHints, scope]);

  if (!active) return null;

  return (
    <aside className="space-y-2">
      <button
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700"
        onClick={togglePanel}
        type="button"
      >
        Observaciones del sistema {panelOpen ? "▾" : "▸"}
      </button>

      {panelOpen ? (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
          {observations.length === 0 ? (
            <p className="text-xs text-slate-500">No hay observaciones desbloqueadas todavía.</p>
          ) : (
            observations.map((item) => (
              <div className="rounded-lg bg-slate-50 p-2" key={item.id}>
                <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">{item.message}</p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </aside>
  );
};
