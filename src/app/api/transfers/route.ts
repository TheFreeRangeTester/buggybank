import { TransactionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transferSchema } from "@/lib/schemas";
import {
  buildTransferReference,
  pickErrorMessage,
  shouldAllowWeakValidation,
  shouldDuplicateTransfer,
  shouldEnableEdgeCaseBypass
} from "@/lib/bugs/rules";
import { getBugFlags } from "@/lib/bugs/flags";

export async function POST(request: Request) {
  const bugFlags = getBugFlags();
  const userId = await getAuthUserId();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = transferSchema.safeParse(body);
  const weakValidation = shouldAllowWeakValidation(bugFlags);
  const bypassEdgeCases = shouldEnableEdgeCaseBypass(bugFlags);

  if (!parsed.success && !weakValidation) {
    return NextResponse.json({ message: "Transferencia inválida" }, { status: 400 });
  }

  const fromAccountId = String(body.fromAccountId ?? "");
  const toAccountId = String(body.toAccountId ?? "");
  const amount = Number(body.amount ?? 0);
  const note = typeof body.note === "string" ? body.note.trim() : null;

  if (!bypassEdgeCases && fromAccountId === toAccountId) {
    return NextResponse.json({ message: "Cuenta origen y destino no pueden ser iguales" }, { status: 400 });
  }

  if (!weakValidation && amount <= 0) {
    return NextResponse.json({ message: "Monto inválido" }, { status: 400 });
  }

  const fromAccount = await prisma.account.findFirst({
    where: {
      id: fromAccountId,
      userId
    }
  });

  const toAccount = await prisma.account.findFirst({
    where: {
      id: toAccountId,
      userId
    }
  });

  if (!fromAccount || !toAccount) {
    return NextResponse.json(
      {
        message: pickErrorMessage(bugFlags, "Cuentas inválidas", "Account mismatch")
      },
      { status: 400 }
    );
  }

  if (!weakValidation && fromAccount.balance < amount) {
    return NextResponse.json({ message: "Fondos insuficientes" }, { status: 400 });
  }

  const duplicateTransfer = shouldDuplicateTransfer(
    bugFlags,
    amount,
    request.headers.get("x-bb-submit-burst")
  );

  await prisma.$transaction(async (tx) => {
    await tx.account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: amount } }
    });

    await tx.account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: amount } }
    });

    await tx.transaction.create({
      data: {
        initiatorId: userId,
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount,
        note,
        status: TransactionStatus.COMPLETED,
        referenceCode: buildTransferReference()
      }
    });

    if (duplicateTransfer) {
      // Bug didáctico: falta de idempotencia provoca doble impacto contable en ciertas condiciones.
      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: amount } }
      });

      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: amount } }
      });

      await tx.transaction.create({
        data: {
          initiatorId: userId,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          amount,
          note: note ? `${note} (duplicate)` : "duplicate",
          status: TransactionStatus.COMPLETED,
          referenceCode: buildTransferReference(),
          idempotencyKey: "dup-bug"
        }
      });
    }
  });

  return NextResponse.json({
    message: pickErrorMessage(bugFlags, "Transferencia procesada", "OK transfer"),
    duplicated: duplicateTransfer
  });
}
