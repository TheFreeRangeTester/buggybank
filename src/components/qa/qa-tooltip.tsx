"use client";

import { useQaMode } from "@/components/qa/qa-provider";

type QaTooltipProps = {
  hintId: string;
};

export const QaTooltip = ({ hintId }: QaTooltipProps) => {
  const { active, getHintById } = useQaMode();
  if (!active) return null;

  const hint = getHintById(hintId);
  if (!hint || hint.placement !== "tooltip") return null;

  return (
    <span className="group relative inline-flex items-center">
      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500">
        i
      </span>
      <span className="pointer-events-none absolute left-0 top-6 z-20 hidden w-64 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-lg group-hover:block">
        {hint.message}
      </span>
    </span>
  );
};
