"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg" subtitle="Se produjo un error inesperado" title="Error en la aplicación">
        <p className="text-sm text-slate-600">
          Intentá recargar esta sección. Si persiste, repetí el flujo para documentar el bug.
        </p>
        <div className="mt-4">
          <Button onClick={reset} type="button">
            Reintentar
          </Button>
        </div>
      </Card>
    </div>
  );
}
