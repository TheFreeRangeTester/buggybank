import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBugFlags } from "@/lib/bugs/flags";
import { pickDashboardTotal } from "@/lib/bugs/rules";

export async function GET() {
  const bugFlags = getBugFlags();
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
      qaAccess: true,
      cachedTotalBalance: true,
      accounts: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          type: true,
          accountNumber: true,
          currency: true,
          balance: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  const liveBalance = user.accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalBalance = pickDashboardTotal(bugFlags, user.cachedTotalBalance, liveBalance);

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      qaAccess: user.qaAccess
    },
    totalBalance,
    accounts: user.accounts
  });
}
