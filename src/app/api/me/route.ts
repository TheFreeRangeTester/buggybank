import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, qaAccess: true }
  });

  if (!user) {
    return NextResponse.json({ message: "Usuario inválido" }, { status: 401 });
  }

  return NextResponse.json(user);
}
