"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QaHint } from "@/components/qa/qa-hint";
import { QaTooltip } from "@/components/qa/qa-tooltip";
import { useQaMode } from "@/components/qa/qa-provider";
import { challengesCatalog, type ChallengeDifficulty, type ChallengeMode } from "@/data/challenges-catalog";
import { cn } from "@/lib/cn";

type ProgressState = "todo" | "in-progress" | "done";
type ProgressMap = Record<string, ProgressState>;

const difficultyClasses: Record<ChallengeDifficulty, string> = {
  starter: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-rose-50 text-rose-700 border-rose-200"
};

const modeClasses: Record<ChallengeMode, string> = {
  manual: "bg-sky-50 text-sky-700 border-sky-200",
  automation: "bg-indigo-50 text-indigo-700 border-indigo-200",
  hybrid: "bg-violet-50 text-violet-700 border-violet-200"
};

const progressOrder: ProgressState[] = ["todo", "in-progress", "done"];

export default function ChallengesPage() {
  const { trackEvent } = useQaMode();
  const [mode, setMode] = useState<ChallengeMode | "all">("all");
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    trackEvent("challenges_view");
    const stored = window.localStorage.getItem("bb.challenges.progress");
    if (!stored) return;
    try {
      setProgress(JSON.parse(stored) as ProgressMap);
    } catch {
      setProgress({});
    }
  }, [trackEvent]);

  useEffect(() => {
    window.localStorage.setItem("bb.challenges.progress", JSON.stringify(progress));
  }, [progress]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return challengesCatalog.filter((challenge) => {
      const matchesMode = mode === "all" || challenge.mode === mode;
      const matchesDifficulty = difficulty === "all" || challenge.difficulty === difficulty;
      const matchesQuery =
        lowered.length === 0 ||
        challenge.title.toLowerCase().includes(lowered) ||
        challenge.id.toLowerCase().includes(lowered) ||
        challenge.objective.toLowerCase().includes(lowered);
      return matchesMode && matchesDifficulty && matchesQuery;
    });
  }, [difficulty, mode, query]);

  const doneCount = Object.values(progress).filter((status) => status === "done").length;
  const inProgressCount = Object.values(progress).filter((status) => status === "in-progress").length;

  const updateProgress = (id: string): void => {
    trackEvent("challenge_marked");
    setProgress((prev) => {
      const current = prev[id] ?? "todo";
      const next = progressOrder[(progressOrder.indexOf(current) + 1) % progressOrder.length];
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-4">
      <QaHint hintKey="challenges" />

      <Card subtitle="Escenarios guiados para práctica manual + automation" title="Laboratorio de Desafíos">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{challengesCatalog.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">En progreso</p>
            <p className="mt-1 text-2xl font-semibold text-amber-700">{inProgressCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Resueltos</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">{doneCount}</p>
          </div>
        </div>
      </Card>

      <Card subtitle="Filtrá por tipo de práctica y dificultad" title="Explorar Casos">
        <div className="grid gap-3 md:grid-cols-3">
          <Select
            id="challenge-mode"
            label="Modo"
            onChange={(event) => {
              setMode(event.target.value as ChallengeMode | "all");
              trackEvent("challenges_filter_change");
            }}
            value={mode}
          >
            <option value="all">Todos</option>
            <option value="manual">Manual</option>
            <option value="automation">Automation</option>
            <option value="hybrid">Híbrido</option>
          </Select>
          <Select
            id="challenge-difficulty"
            label="Dificultad"
            onChange={(event) => {
              setDifficulty(event.target.value as ChallengeDifficulty | "all");
              trackEvent("challenges_filter_change");
            }}
            value={difficulty}
          >
            <option value="all">Todas</option>
            <option value="starter">Starter</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
          <label className="block space-y-1" htmlFor="challenge-query">
            <span className="text-sm font-medium text-slate-700">
              Buscar
              <QaTooltip hintId="challenges-hybrid-coverage" />
            </span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              id="challenge-query"
              onChange={(event) => {
                setQuery(event.target.value);
                trackEvent("challenges_filter_change");
              }}
              placeholder="ID, título u objetivo"
              value={query}
            />
          </label>
        </div>
      </Card>

      {filtered.length === 0 ? <EmptyState message="No hay desafíos para esos filtros." /> : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((challenge) => {
          const current = progress[challenge.id] ?? "todo";
          return (
            <Card key={challenge.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{challenge.id}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={cn("rounded-full border px-2 py-1 font-medium", difficultyClasses[challenge.difficulty])}>
                    {challenge.difficulty}
                  </span>
                  <span className={cn("rounded-full border px-2 py-1 font-medium", modeClasses[challenge.mode])}>
                    {challenge.mode}
                  </span>
                </div>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-slate-900">{challenge.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{challenge.objective}</p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cómo reproducir</p>
                <ol className="mt-2 space-y-1 pl-4 text-sm text-slate-700">
                  {challenge.steps.map((step) => (
                    <li key={step} className="list-decimal">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Bug objetivo:</span> {challenge.bugTargets.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Idea Playwright:</span> {challenge.playwrightIdea}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Heurística:</span> {challenge.assertionHint}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full border px-2 py-1 text-xs font-medium",
                    current === "todo" && "border-slate-300 bg-slate-100 text-slate-700",
                    current === "in-progress" && "border-amber-200 bg-amber-50 text-amber-700",
                    current === "done" && "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  Estado: {current}
                </span>
                <Button onClick={() => updateProgress(challenge.id)} type="button" variant="secondary">
                  Avanzar estado
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
