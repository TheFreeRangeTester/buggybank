import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      type: true,
      accountNumber: true,
      currency: true,
      balance: true,
      isActive: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ data: accounts });
}
