"use client";

import { useMemo } from "react";
import { useQaMode } from "@/components/qa/qa-provider";
import type { QaScope } from "@/data/qa-hints-catalog";

const severityClasses = {
  low: "border-sky-200 bg-sky-50 text-sky-800",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  high: "border-rose-200 bg-rose-50 text-rose-800"
};

type QaHintProps = {
  hintKey: Exclude<QaScope, "global">;
};

export const QaHint = ({ hintKey }: QaHintProps) => {
  const { active, getHints } = useQaMode();

  const hints = useMemo(() => {
    return getHints(hintKey, "banner").slice(0, 2);
  }, [getHints, hintKey]);

  if (!active || hints.length === 0) return null;

  return (
    <div className="space-y-2">
      {hints.map((hint) => (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${severityClasses[hint.severity]}`}
          key={hint.id}
          role="status"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{hint.title}</span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {hint.difficulty}
            </span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {hint.severity}
            </span>
          </div>
          <p className="mt-1">{hint.message}</p>
        </div>
      ))}
    </div>
  );
};
