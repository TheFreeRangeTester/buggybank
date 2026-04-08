import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg" subtitle="La ruta solicitada no existe" title="404 · Página no encontrada">
        <p className="text-sm text-slate-600">
          Puede que el enlace esté desactualizado o que la página haya cambiado de ubicación.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/dashboard">
            <Button type="button">Ir al dashboard</Button>
          </Link>
          <Link href="/login">
            <Button type="button" variant="secondary">
              Ir a login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
