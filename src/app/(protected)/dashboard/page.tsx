"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { QaHint } from "@/components/qa/qa-hint";
import { QaInlineHint } from "@/components/qa/qa-inline-hint";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatMoney } from "@/lib/format";
import { useQaMode } from "@/components/qa/qa-provider";
import type { DashboardPayload } from "@/types";

export default function DashboardPage() {
  const { trackEvent } = useQaMode();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("dashboard_view");
    const load = async (): Promise<void> => {
      setError(null);
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        const payload = (await response.json()) as DashboardPayload & { message?: string };

        if (!response.ok) {
          setError(payload.message ?? "No se pudo cargar el dashboard");
          return;
        }

        setData(payload);
      } catch {
        setError("Servicio temporalmente no disponible");
      }
    };

    void load();
  }, [trackEvent]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState message="Cargando saldo y cuentas..." />;

  return (
    <div className="space-y-4">
      <QaHint hintKey="dashboard" />

      <Card subtitle="Resumen consolidado" title={`Hola, ${data.user.fullName}`}>
        <p className="text-3xl font-semibold text-slate-900">{formatMoney(data.totalBalance)}</p>
        <p className="mt-1 text-sm text-slate-500">Saldo total disponible</p>
        <div className="mt-3">
          <QaInlineHint hintId="dashboard-after-transfer" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.accounts.map((account) => (
          <StatCard
            helper={account.accountNumber}
            key={account.id}
            title={`${account.type} account`}
            value={formatMoney(account.balance, account.currency)}
          />
        ))}
      </div>
    </div>
  );
}
