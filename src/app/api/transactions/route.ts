import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBugFlags } from "@/lib/bugs/flags";
import { pickHistoryOrder, shouldApplyBrokenIncomingFilter } from "@/lib/bugs/rules";

export async function GET(request: Request) {
  const bugFlags = getBugFlags();
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const direction = url.searchParams.get("direction") ?? "all";
  const query = (url.searchParams.get("query") ?? "").trim();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  const historyOrder = pickHistoryOrder(bugFlags, user?.email, direction);

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromAccount: { userId } },
        { toAccount: { userId } }
      ]
    },
    include: {
      fromAccount: {
        include: {
          user: { select: { fullName: true } }
        }
      },
      toAccount: {
        include: {
          user: { select: { fullName: true } }
        }
      }
    },
    orderBy: { createdAt: historyOrder }
  });

  const mapped = transactions.map((tx) => {
    const directionValue = tx.toAccount.userId === userId ? "incoming" : "outgoing";
    const counterpartyName = directionValue === "incoming" ? tx.fromAccount.user.fullName : tx.toAccount.user.fullName;

    return {
      id: tx.id,
      createdAt: tx.createdAt.toISOString(),
      amount: tx.amount,
      note: tx.note,
      status: tx.status,
      direction: directionValue,
      fromAccountNumber: tx.fromAccount.accountNumber,
      toAccountNumber: tx.toAccount.accountNumber,
      counterpartyName
    };
  });

  let filtered = mapped;

  if (direction !== "all") {
    if (shouldApplyBrokenIncomingFilter(bugFlags, direction, query)) {
      filtered = mapped.filter((tx) => tx.direction === "outgoing");
    } else {
      filtered = mapped.filter((tx) => tx.direction === direction);
    }
  }

  if (query.length > 0) {
    filtered = filtered.filter((tx) => {
      return (
        tx.note?.includes(query) ||
        tx.fromAccountNumber.includes(query) ||
        tx.toAccountNumber.includes(query)
      );
    });
  }

  return NextResponse.json({ data: filtered });
}
