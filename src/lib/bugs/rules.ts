import type { BugFlags } from "@/lib/bugs/flags";

export const pickErrorMessage = (
  flags: BugFlags,
  consistentMessage: string,
  inconsistentMessage: string
): string => {
  return flags.inconsistentErrors ? inconsistentMessage : consistentMessage;
};

export const pickDashboardTotal = (
  flags: BugFlags,
  cachedTotal: number,
  liveTotal: number
): number => {
  // Bug didáctico: total de dashboard puede quedar stale respecto al detalle.
  return flags.staleDashboardBalance ? cachedTotal : liveTotal;
};

export const pickHistoryOrder = (
  flags: BugFlags,
  userEmail: string | undefined,
  direction: string
): "asc" | "desc" => {
  // Bug didáctico: en ciertos filtros/usuarios el orden se invierte.
  if (flags.historyOrder && userEmail === "diego@buggybank.local" && direction !== "all") {
    return "asc";
  }
  return "desc";
};

export const shouldApplyBrokenIncomingFilter = (
  flags: BugFlags,
  direction: string,
  query: string
): boolean => {
  // Bug didáctico: el filtro entrante falla con ciertas combinaciones.
  return flags.brokenFilter && direction === "incoming" && query.length <= 2;
};

export const shouldAllowWeakValidation = (flags: BugFlags): boolean => {
  // Bug didáctico: backend tolera inputs inválidos cuando está activo.
  return flags.weakValidation;
};

export const shouldDuplicateTransfer = (
  flags: BugFlags,
  amount: number,
  xSubmitBurst: string | null
): boolean => {
  // Bug didáctico: doble submit sin idempotencia en condiciones de ráfaga.
  if (!flags.doubleSubmit) return false;
  if (xSubmitBurst === "1") return true;
  return amount >= 500 && Number.isInteger(amount);
};

export const shouldEnableEdgeCaseBypass = (flags: BugFlags): boolean => {
  // Bug didáctico: se saltan guardas de edge cases.
  return flags.edgeCases;
};

export const buildTransferReference = (): string => {
  const now = Date.now().toString(36);
  const rnd = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `BB-${now}-${rnd}`;
};
