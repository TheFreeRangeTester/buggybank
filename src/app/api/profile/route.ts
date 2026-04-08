import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/schemas";
import { getBugFlags } from "@/lib/bugs/flags";
import { pickErrorMessage, shouldEnableEdgeCaseBypass } from "@/lib/bugs/rules";

export async function GET() {
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      preferredLanguage: true
    }
  });

  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const bugFlags = getBugFlags();
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success && !shouldEnableEdgeCaseBypass(bugFlags)) {
    return NextResponse.json({ message: "Datos de perfil inválidos" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const phone = typeof body.phone === "string" ? body.phone : null;
  const preferredLanguage = body.preferredLanguage === "en-NZ" ? "en-NZ" : "es-NZ";

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName,
      phone,
      preferredLanguage
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      preferredLanguage: true
    }
  });

  return NextResponse.json({
    message: pickErrorMessage(bugFlags, "Perfil actualizado", "Saved profile"),
    profile: updated
  });
}
