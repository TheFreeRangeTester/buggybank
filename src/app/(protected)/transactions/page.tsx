"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { QaHint } from "@/components/qa/qa-hint";
import { QaInlineHint } from "@/components/qa/qa-inline-hint";
import { QaTooltip } from "@/components/qa/qa-tooltip";
import { Select } from "@/components/ui/select";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatDate, formatMoney } from "@/lib/format";
import { useQaMode } from "@/components/qa/qa-provider";
import type { TransactionItem } from "@/types";

const columns = [
  { key: "createdAt", header: "Fecha" },
  { key: "direction", header: "Tipo" },
  { key: "amount", header: "Monto" },
  { key: "accounts", header: "Cuentas" },
  { key: "counterparty", header: "Contraparte" },
  { key: "note", header: "Descripción" }
];

export default function TransactionsPage() {
  const { trackEvent } = useQaMode();
  const [transactions, setTransactions] = useState<TransactionItem[] | null>(null);
  const [direction, setDirection] = useState("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("transactions_view");
  }, [trackEvent]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setError(null);
      const params = new URLSearchParams();
      params.set("direction", direction);
      params.set("query", query);

      try {
        const response = await fetch(`/api/transactions?${params.toString()}`, {
          cache: "no-store"
        });
        const payload = (await response.json()) as { data?: TransactionItem[]; message?: string };

        if (!response.ok || !payload.data) {
          setError(payload.message ?? "No se pudieron cargar movimientos");
          return;
        }

        setTransactions(payload.data);
      } catch {
        setError("No hay conexión con el historial");
      }
    };

    void load();
  }, [direction, query]);

  useEffect(() => {
    if (direction !== "all" || query.length > 0) {
      trackEvent("transactions_filter_change");
    }
  }, [direction, query, trackEvent]);

  const list = useMemo(() => transactions ?? [], [transactions]);

  return (
    <div className="space-y-4">
      <QaHint hintKey="transactions" />

      <Card subtitle="Búsqueda y filtros" title="Historial de movimientos">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr]">
          <Select
            data-testid="transactions-direction"
            id="direction"
            label="Dirección"
            onChange={(event) => setDirection(event.target.value)}
            value={direction}
          >
            <option value="all">Todas</option>
            <option value="incoming">Entrantes</option>
            <option value="outgoing">Salientes</option>
          </Select>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Buscar por nota o cuenta</span>
            <QaTooltip hintId="tx-filter-direction" />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              data-testid="transactions-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej: rent, 0099887"
              value={query}
            />
          </label>
        </div>
        <div className="mt-3">
          <QaInlineHint hintId="tx-filter-combinations" />
        </div>
      </Card>

      {error ? <ErrorState message={error} /> : null}
      {!transactions ? <LoadingState message="Consultando movimientos..." /> : null}
      {transactions && list.length === 0 ? <EmptyState message="No hay movimientos para este filtro" /> : null}

      {list.length > 0 ? (
        <Card title="Últimos movimientos">
          <Table
            columns={columns}
            renderCell={(tx, key, index) => {
              if (key === "createdAt") return <span className="whitespace-nowrap">{formatDate(tx.createdAt, index)}</span>;
              if (key === "direction") {
                return (
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      tx.direction === "incoming" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tx.direction === "incoming" ? "Ingreso" : "Salida"}
                  </span>
                );
              }
              if (key === "amount") return <span className="font-medium">{formatMoney(tx.amount)}</span>;
              if (key === "accounts") return `${tx.fromAccountNumber} → ${tx.toAccountNumber}`;
              if (key === "counterparty") return tx.counterpartyName;
              if (key === "note") return tx.note || "Sin descripción";
              return "-";
            }}
            rows={list}
          />
        </Card>
      ) : null}
    </div>
  );
}
