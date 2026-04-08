"use client";

import { useQaMode } from "@/components/qa/qa-provider";

type QaInlineHintProps = {
  hintId: string;
};

export const QaInlineHint = ({ hintId }: QaInlineHintProps) => {
  const { active, getHintById } = useQaMode();

  if (!active) return null;

  const hint = getHintById(hintId);
  if (!hint) return null;

  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
      {hint.message}
    </p>
  );
};
