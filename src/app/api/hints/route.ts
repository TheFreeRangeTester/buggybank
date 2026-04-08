import { HintTarget } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isQaModeGloballyEnabled } from "@/lib/bugs/flags";

const parseTarget = (value: string | null): HintTarget | undefined => {
  if (!value) return undefined;
  const upper = value.toUpperCase();

  if (upper === "LOGIN") return HintTarget.LOGIN;
  if (upper === "DASHBOARD") return HintTarget.DASHBOARD;
  if (upper === "TRANSFERS") return HintTarget.TRANSFERS;
  if (upper === "TRANSACTIONS") return HintTarget.TRANSACTIONS;
  if (upper === "PROFILE") return HintTarget.PROFILE;

  return undefined;
};

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const headerQa = request.headers.get("x-qa-mode") === "true";
  const queryQa = url.searchParams.get("qaMode") === "1";
  const qaActive = isQaModeGloballyEnabled() && (headerQa || queryQa);

  if (!qaActive) {
    return NextResponse.json({ data: [] });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { qaAccess: true }
  });

  if (!user?.qaAccess) {
    return NextResponse.json({ message: "QA Mode no habilitado para este usuario" }, { status: 403 });
  }

  const levelParam = Number(url.searchParams.get("level") ?? 1);
  const level = Number.isFinite(levelParam) ? Math.max(1, Math.min(3, levelParam)) : 1;
  const target = parseTarget(url.searchParams.get("target"));

  const hints = await prisma.hint.findMany({
    where: {
      isActive: true,
      level: { lte: level },
      ...(target ? { target } : {}),
      OR: [{ bugFlagId: null }, { bugFlag: { isEnabled: true } }]
    },
    include: {
      bugFlag: {
        select: { key: true, title: true, isEnabled: true }
      }
    },
    orderBy: [{ target: "asc" }, { level: "asc" }, { createdAt: "asc" }]
  });

  return NextResponse.json({ data: hints, meta: { level } });
}
