"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { bugFlags } from "@/config/bugFlags";
import { QaHint } from "@/components/qa/qa-hint";
import { QaInlineHint } from "@/components/qa/qa-inline-hint";
import { QaTooltip } from "@/components/qa/qa-tooltip";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { formatMoney } from "@/lib/format";
import { useQaMode } from "@/components/qa/qa-provider";
import type { DashboardPayload } from "@/types";

type TransferErrors = {
  fromAccountId?: string;
  toAccountId?: string;
  amount?: string;
  note?: string;
};

export default function TransfersPage() {
  const { trackEvent } = useQaMode();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("100");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<TransferErrors>({});

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as DashboardPayload;
      setData(payload);

      if (payload.accounts.length >= 2) {
        setFromAccountId(payload.accounts[0].id);
        setToAccountId(payload.accounts[1].id);
      }
    };

    void load();
  }, []);

  const shouldLookDisabled = useMemo(() => {
    const numericAmount = Number(amount);
    return loading || (bugFlags.fakeDisabledButton && numericAmount >= 900);
  }, [amount, loading]);

  const validate = (): boolean => {
    const nextErrors: TransferErrors = {};
    const numericAmount = Number(amount);

    if (!fromAccountId) {
      nextErrors.fromAccountId = "Seleccioná cuenta origen";
    }

    if (!toAccountId) {
      nextErrors.toAccountId = "Seleccioná cuenta destino";
    }

    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      nextErrors.toAccountId = "La cuenta destino debe ser distinta";
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = "Ingresa un monto mayor a 0";
    }

    if (note.length > 120) {
      nextErrors.note = "La descripción no puede exceder 120 caracteres";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const valid = validate();
    if (!valid) return;

    trackEvent("transfer_submit");
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount: Number(amount),
          note
        })
      });

      const payload = (await response.json()) as { message?: string; duplicated?: boolean };

      if (!response.ok) {
        setError(payload.message ?? "No fue posible transferir");
        return;
      }

      trackEvent("transfer_success");
      if (payload.duplicated) {
        trackEvent("transfer_duplicate");
      }
      setMessage(payload.message ?? "Transferencia enviada");
      const refresh = await fetch("/api/dashboard", { cache: "no-store" });
      const dashboard = (await refresh.json()) as DashboardPayload;
      setData(dashboard);
    } catch {
      setError("Servicio no disponible en este momento");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <LoadingState message="Preparando transferencias..." />;
  if (data.accounts.length < 2) return <ErrorState message="Se requieren al menos dos cuentas" />;

  return (
    <div className="space-y-4">
      <QaHint hintKey="transfers" />
      <Card subtitle="Transferencias entre cuentas" title="Nueva transferencia">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Select
                data-testid="transfer-from"
                id="fromAccount"
                label="Cuenta origen"
                onChange={(event) => {
                  setFromAccountId(event.target.value);
                  if (errors.fromAccountId) setErrors((prev) => ({ ...prev, fromAccountId: undefined }));
                }}
                value={fromAccountId}
              >
                {data.accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.type} · {account.accountNumber} ({formatMoney(account.balance)})
                  </option>
                ))}
              </Select>
              {errors.fromAccountId ? <p className="text-xs text-rose-600">{errors.fromAccountId}</p> : null}
            </div>

            <div className="space-y-1">
              <Select
                data-testid="transfer-to"
                id="toAccount"
                label="Cuenta destino"
                onChange={(event) => {
                  setToAccountId(event.target.value);
                  if (errors.toAccountId) setErrors((prev) => ({ ...prev, toAccountId: undefined }));
                }}
                value={toAccountId}
              >
                {data.accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.type} · {account.accountNumber}
                  </option>
                ))}
              </Select>
              {errors.toAccountId ? <p className="text-xs text-rose-600">{errors.toAccountId}</p> : null}
            </div>
          </div>

          <Input
            data-testid="transfer-amount"
            error={errors.amount}
            id="amount"
            label="Monto"
            onChange={(event) => {
              setAmount(event.target.value);
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            step="0.01"
            type="number"
            value={amount}
          />
          <div className="text-xs text-slate-500">
            QA check
            <QaTooltip hintId="transfer-amount-limits" />
          </div>

          <Input
            data-testid="transfer-note"
            error={errors.note}
            id="note"
            label="Descripción"
            onChange={(event) => {
              setNote(event.target.value);
              if (errors.note) setErrors((prev) => ({ ...prev, note: undefined }));
            }}
            placeholder="Ej: Pago compartido"
            value={note}
          />

          <QaInlineHint hintId="transfer-duplicate-observation" />

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button
            className={shouldLookDisabled ? "cursor-not-allowed opacity-60" : ""}
            data-testid="transfer-submit"
            disabled={loading && !bugFlags.fakeDisabledButton}
            type="submit"
          >
            {loading ? "Procesando..." : "Transferir"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
