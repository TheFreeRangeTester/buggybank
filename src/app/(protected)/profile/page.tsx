"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { QaHint } from "@/components/qa/qa-hint";
import { QaInlineHint } from "@/components/qa/qa-inline-hint";
import { QaTooltip } from "@/components/qa/qa-tooltip";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { useQaMode } from "@/components/qa/qa-provider";

type ProfilePayload = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  preferredLanguage: "es-NZ" | "en-NZ";
};

type ProfileErrors = {
  fullName?: string;
  phone?: string;
};

export default function ProfilePage() {
  const { trackEvent } = useQaMode();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    trackEvent("profile_view");
    const load = async (): Promise<void> => {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const payload = (await response.json()) as ProfilePayload;
      setProfile(payload);
    };

    void load();
  }, [trackEvent]);

  const hasValidForm = useMemo(() => {
    if (!profile) return false;
    return profile.fullName.trim().length >= 2 && (profile.phone?.length ?? 0) <= 30;
  }, [profile]);

  if (!profile) return <LoadingState message="Cargando perfil..." />;

  const validate = (): boolean => {
    const nextErrors: ProfileErrors = {};

    if (profile.fullName.trim().length < 2) {
      nextErrors.fullName = "El nombre debe tener al menos 2 caracteres";
    }

    if ((profile.phone?.length ?? 0) > 30) {
      nextErrors.phone = "El teléfono no puede exceder 30 caracteres";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const valid = validate();
    if (!valid) return;

    trackEvent("profile_submit");
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      const payload = (await response.json()) as { message?: string; profile?: ProfilePayload };

      if (!response.ok) {
        setError(payload.message ?? "No se pudo actualizar");
        return;
      }

      if (payload.profile) {
        setProfile(payload.profile);
      }

      trackEvent("profile_saved");
      setMessage(payload.message ?? "Perfil actualizado");
    } catch {
      setError("Servicio de perfil no disponible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <QaHint hintKey="profile" />
      <Card subtitle="Configuración de usuario" title="Perfil y preferencias">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            error={errors.fullName}
            id="fullName"
            label="Nombre"
            onChange={(event) => {
              setProfile({ ...profile, fullName: event.target.value });
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            value={profile.fullName}
          />
          <div className="text-xs text-slate-500">
            QA check
            <QaTooltip hintId="profile-format-tooltip" />
          </div>

          <Input disabled id="email" label="Email" onChange={() => undefined} value={profile.email} />

          <Input
            error={errors.phone}
            id="phone"
            label="Teléfono"
            onChange={(event) => {
              setProfile({ ...profile, phone: event.target.value });
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            value={profile.phone ?? ""}
          />

          <Select
            id="language"
            label="Idioma"
            onChange={(event) =>
              setProfile({ ...profile, preferredLanguage: event.target.value as "es-NZ" | "en-NZ" })
            }
            value={profile.preferredLanguage}
          >
            <option value="es-NZ">Español (NZ)</option>
            <option value="en-NZ">English (NZ)</option>
          </Select>

          <QaInlineHint hintId="profile-save-consistency" />

          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button disabled={saving || !hasValidForm} type="submit">
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
