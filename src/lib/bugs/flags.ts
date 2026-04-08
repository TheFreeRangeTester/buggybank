export type BugFlags = {
  weakValidation: boolean;
  inconsistentErrors: boolean;
  doubleSubmit: boolean;
  staleDashboardBalance: boolean;
  historyOrder: boolean;
  brokenFilter: boolean;
  edgeCases: boolean;
};

const readBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

export const getBugFlags = (): BugFlags => {
  return {
    weakValidation: readBool(process.env.NEXT_PUBLIC_BUG_WEAK_VALIDATION, true),
    inconsistentErrors: readBool(process.env.NEXT_PUBLIC_BUG_INCONSISTENT_ERRORS, true),
    doubleSubmit: readBool(process.env.NEXT_PUBLIC_BUG_DOUBLE_SUBMIT, true),
    staleDashboardBalance: readBool(process.env.NEXT_PUBLIC_BUG_STALE_DASHBOARD_BALANCE, true),
    historyOrder: readBool(process.env.NEXT_PUBLIC_BUG_HISTORY_ORDER, true),
    brokenFilter: readBool(process.env.NEXT_PUBLIC_BUG_BROKEN_FILTER, true),
    edgeCases: readBool(process.env.NEXT_PUBLIC_BUG_EDGE_CASES, true)
  };
};

export const isQaModeGloballyEnabled = (): boolean => {
  return readBool(process.env.NEXT_PUBLIC_ENABLE_QA_MODE, true);
};
