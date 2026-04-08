"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQaMode } from "@/components/qa/qa-provider";
import { QaInlineHint } from "@/components/qa/qa-inline-hint";
import { QaHint } from "@/components/qa/qa-hint";

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { enabled, active, setActive, trackEvent } = useQaMode();

  const [email, setEmail] = useState("maria@buggybank.local");
  const [password, setPassword] = useState("Pass1234");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("login_view");
  }, [trackEvent]);

  const isValid = useMemo(() => {
    return emailRegex.test(email.trim()) && password.length >= 4;
  }, [email, password]);

  const validate = (): boolean => {
    const nextErrors: LoginErrors = {};

    if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Ingresa un email válido";
    }

    if (password.length < 4) {
      nextErrors.password = "La contraseña debe tener al menos 4 caracteres";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formIsValid = validate();
    if (!formIsValid) return;

    trackEvent("login_submit");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        trackEvent("login_error");
        setError(payload.message ?? "No se pudo iniciar sesión");
        return;
      }

      trackEvent("login_success");
      router.push("/dashboard");
      router.refresh();
    } catch {
      trackEvent("login_error");
      setError("No se pudo conectar con el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md" subtitle="Ingreso sandbox" title="Bienvenido a BuggyBank">
        {enabled ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <span className="font-medium text-slate-600">QA Mode</span>
            <button
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700"
              onClick={() => {
                setActive(!active);
              }}
              type="button"
            >
              {active ? "Activado" : "Desactivado"}
            </button>
          </div>
        ) : null}

        <QaHint hintKey="login" />

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            data-testid="login-email"
            error={errors.email}
            id="email"
            label="Email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="correo@buggybank.local"
            type="email"
            value={email}
          />
          <QaInlineHint hintId="login-network-vs-validation" />

          <Input
            data-testid="login-password"
            error={errors.password}
            id="password"
            label="Contraseña"
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            type="password"
            value={password}
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" data-testid="login-submit" disabled={loading || !isValid} type="submit">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p>Usuarios de prueba:</p>
          <p>maria@buggybank.local / Pass1234</p>
          <p>diego@buggybank.local / Pass1234</p>
          <p>sofie@buggybank.local / Pass1234</p>
        </div>
      </Card>
    </div>
  );
}
