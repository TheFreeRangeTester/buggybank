import {
  AccountType,
  BugSeverity,
  HintTarget,
  PrismaClient,
  TransactionStatus
} from "@prisma/client";

const prisma = new PrismaClient();

const ref = (code: string): string => `BB-${code}`;

async function main() {
  await prisma.hint.deleteMany();
  await prisma.bugFlag.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const [maria, diego, sofie] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "maria@buggybank.local",
        password: "Pass1234",
        fullName: "Maria Thompson",
        phone: "+64 21 111 0091",
        preferredLanguage: "es-NZ",
        qaAccess: true,
        cachedTotalBalance: 17640.4
      }
    }),
    prisma.user.create({
      data: {
        email: "diego@buggybank.local",
        password: "Pass1234",
        fullName: "Diego Alvarez",
        phone: "+64 21 777 4488",
        preferredLanguage: "es-NZ",
        qaAccess: true,
        cachedTotalBalance: 8220.1
      }
    }),
    prisma.user.create({
      data: {
        email: "sofie@buggybank.local",
        password: "Pass1234",
        fullName: "Sofie Patel",
        phone: "+64 22 632 9090",
        preferredLanguage: "en-NZ",
        qaAccess: false,
        cachedTotalBalance: 5402.84
      }
    })
  ]);

  const [mariaChecking, mariaSavings, diegoChecking, diegoSavings, sofieChecking, sofieSavings] =
    await prisma.$transaction([
      prisma.account.create({
        data: {
          userId: maria.id,
          type: AccountType.CHECKING,
          accountNumber: "12-3456-0099887-00",
          currency: "NZD",
          balance: 13840.4
        }
      }),
      prisma.account.create({
        data: {
          userId: maria.id,
          type: AccountType.SAVINGS,
          accountNumber: "12-3456-0099887-90",
          currency: "NZD",
          balance: 3800.0
        }
      }),
      prisma.account.create({
        data: {
          userId: diego.id,
          type: AccountType.CHECKING,
          accountNumber: "98-1122-7766554-00",
          currency: "NZD",
          balance: 3220.1
        }
      }),
      prisma.account.create({
        data: {
          userId: diego.id,
          type: AccountType.SAVINGS,
          accountNumber: "98-1122-7766554-77",
          currency: "NZD",
          balance: 5000.0
        }
      }),
      prisma.account.create({
        data: {
          userId: sofie.id,
          type: AccountType.CHECKING,
          accountNumber: "55-2233-1144776-00",
          currency: "NZD",
          balance: 1280.75
        }
      }),
      prisma.account.create({
        data: {
          userId: sofie.id,
          type: AccountType.SAVINGS,
          accountNumber: "55-2233-1144776-11",
          currency: "NZD",
          balance: 4122.09
        }
      })
    ]);

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        initiatorId: maria.id,
        fromAccountId: mariaChecking.id,
        toAccountId: diegoChecking.id,
        amount: 210.5,
        note: "Shared rent April",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240401-0001"),
        createdAt: new Date("2026-04-01T09:15:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: maria.id,
        fromAccountId: mariaSavings.id,
        toAccountId: mariaChecking.id,
        amount: 800,
        note: "Monthly budget transfer",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240401-0002"),
        createdAt: new Date("2026-04-01T09:16:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: diego.id,
        fromAccountId: diegoSavings.id,
        toAccountId: sofieChecking.id,
        amount: 120,
        note: "Birthday dinner",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240402-0001"),
        createdAt: new Date("2026-04-02T19:41:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: sofie.id,
        fromAccountId: sofieChecking.id,
        toAccountId: mariaChecking.id,
        amount: 55.25,
        note: "Cab split",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240403-0001"),
        createdAt: new Date("2026-04-03T15:11:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: diego.id,
        fromAccountId: diegoChecking.id,
        toAccountId: mariaChecking.id,
        amount: 75,
        note: "Coffee beans",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240404-0001"),
        createdAt: new Date("2026-04-04T11:35:00.000Z")
      }
    }),

    prisma.transaction.create({
      data: {
        initiatorId: maria.id,
        fromAccountId: mariaChecking.id,
        toAccountId: sofieSavings.id,
        amount: 0.01,
        note: "Limit test min amount",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240405-0001"),
        createdAt: new Date("2026-04-05T08:00:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: maria.id,
        fromAccountId: mariaChecking.id,
        toAccountId: sofieSavings.id,
        amount: 9999.99,
        note: "Limit test high amount",
        status: TransactionStatus.PENDING,
        referenceCode: ref("240405-0002"),
        idempotencyKey: "idem-high-001",
        createdAt: new Date("2026-04-05T08:00:40.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: diego.id,
        fromAccountId: diegoChecking.id,
        toAccountId: mariaSavings.id,
        amount: 480.0,
        note: "Rent reimbursement - duplicate attempt",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240406-0001"),
        idempotencyKey: "dup-rent-480",
        createdAt: new Date("2026-04-06T10:22:10.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: diego.id,
        fromAccountId: diegoChecking.id,
        toAccountId: mariaSavings.id,
        amount: 480.0,
        note: "Rent reimbursement - duplicate attempt",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240406-0002"),
        idempotencyKey: "dup-rent-480",
        createdAt: new Date("2026-04-06T10:22:13.000Z")
      }
    }),

    prisma.transaction.create({
      data: {
        initiatorId: sofie.id,
        fromAccountId: sofieChecking.id,
        toAccountId: diegoSavings.id,
        amount: 49.99,
        note: "" +
          "Monthly software subscription for collaborative QA sandbox usage with extra metadata fields " +
          "and intentionally verbose context text to stress UI rendering, truncation and search filters.",
        status: TransactionStatus.FAILED,
        failureReason: "Insufficient funds after pending holds",
        referenceCode: ref("240407-0001"),
        createdAt: new Date("2026-04-07T09:00:00.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: sofie.id,
        fromAccountId: sofieChecking.id,
        toAccountId: diegoSavings.id,
        amount: 49.99,
        note: "Retry after failed transfer",
        status: TransactionStatus.REVERSED,
        failureReason: "Manual reversal by operations",
        referenceCode: ref("240407-0002"),
        createdAt: new Date("2026-04-07T09:00:02.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: sofie.id,
        fromAccountId: sofieChecking.id,
        toAccountId: diegoSavings.id,
        amount: 49.99,
        note: "Retry after failed transfer",
        status: TransactionStatus.COMPLETED,
        referenceCode: ref("240407-0003"),
        createdAt: new Date("2026-04-07T09:00:03.000Z")
      }
    }),
    prisma.transaction.create({
      data: {
        initiatorId: maria.id,
        fromAccountId: mariaSavings.id,
        toAccountId: mariaChecking.id,
        amount: 300,
        note: "Scheduled transfer cancelled by user",
        status: TransactionStatus.CANCELLED,
        referenceCode: ref("240408-0001"),
        createdAt: new Date("2026-04-08T06:05:00.000Z")
      }
    })
  ]);

  const bugFlags = await prisma.$transaction([
    prisma.bugFlag.create({
      data: {
        key: "weak_validation",
        title: "Validación insuficiente",
        description: "Permite montos y combinaciones inválidas en escenarios límite",
        area: "transfers",
        severity: BugSeverity.HIGH,
        isEnabled: true
      }
    }),
    prisma.bugFlag.create({
      data: {
        key: "inconsistent_errors",
        title: "Errores inconsistentes",
        description: "Mensajes de error mezclados entre backend y frontend",
        area: "auth,transfers,profile",
        severity: BugSeverity.MEDIUM,
        isEnabled: true
      }
    }),
    prisma.bugFlag.create({
      data: {
        key: "history_order",
        title: "Orden temporal incorrecto",
        description: "El historial puede mostrarse ascendente para ciertos usuarios",
        area: "transactions",
        severity: BugSeverity.MEDIUM,
        isEnabled: true
      }
    }),
    prisma.bugFlag.create({
      data: {
        key: "fake_disabled_button",
        title: "Botón visualmente deshabilitado",
        description: "El botón parece deshabilitado pero sigue aceptando click",
        area: "transfers-ui",
        severity: BugSeverity.MEDIUM,
        isEnabled: true
      }
    })
  ]);

  const weakValidationFlag = bugFlags.find((item) => item.key === "weak_validation");
  const inconsistentErrorsFlag = bugFlags.find((item) => item.key === "inconsistent_errors");
  const historyOrderFlag = bugFlags.find((item) => item.key === "history_order");

  await prisma.$transaction([
    prisma.hint.create({
      data: {
        target: HintTarget.TRANSFERS,
        level: 1,
        title: "Revisá límites",
        message: "Probar montos mínimos y máximos puede revelar validaciones débiles.",
        bugFlagId: weakValidationFlag?.id
      }
    }),
    prisma.hint.create({
      data: {
        target: HintTarget.TRANSFERS,
        level: 2,
        title: "Duplicados",
        message: "Intentá doble submit rápido y compará reference codes o timestamps.",
        bugFlagId: weakValidationFlag?.id
      }
    }),
    prisma.hint.create({
      data: {
        target: HintTarget.LOGIN,
        level: 1,
        title: "Compará copies",
        message: "No todos los errores usan el mismo estilo ni idioma.",
        bugFlagId: inconsistentErrorsFlag?.id
      }
    }),
    prisma.hint.create({
      data: {
        target: HintTarget.TRANSACTIONS,
        level: 1,
        title: "Chequeá orden",
        message: "Validá si el historial siempre ordena por más reciente primero.",
        bugFlagId: historyOrderFlag?.id
      }
    }),
    prisma.hint.create({
      data: {
        target: HintTarget.DASHBOARD,
        level: 1,
        title: "Consistencia entre vistas",
        message: "Compará saldos de dashboard con los saldos en transferencias después de operar.",
        isActive: true
      }
    })
  ]);

  console.log("Seed completed: users, accounts, transactions, hints and bug flags ready.");
  console.log("Users: maria@buggybank.local / Pass1234 | diego@buggybank.local / Pass1234 | sofie@buggybank.local / Pass1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
