const parseBool = (value: string | undefined, fallback = true): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

export const bugFlags = {
  weakValidation: parseBool(process.env.NEXT_PUBLIC_BUG_WEAK_VALIDATION, true),
  inconsistentErrors: parseBool(process.env.NEXT_PUBLIC_BUG_INCONSISTENT_ERRORS, true),
  doubleSubmit: parseBool(process.env.NEXT_PUBLIC_BUG_DOUBLE_SUBMIT, true),
  staleDashboardBalance: parseBool(process.env.NEXT_PUBLIC_BUG_STALE_DASHBOARD_BALANCE, true),
  historyOrder: parseBool(process.env.NEXT_PUBLIC_BUG_HISTORY_ORDER, true),
  brokenFilter: parseBool(process.env.NEXT_PUBLIC_BUG_BROKEN_FILTER, true),
  inconsistentDates: parseBool(process.env.NEXT_PUBLIC_BUG_INCONSISTENT_DATES, true),
  edgeCases: parseBool(process.env.NEXT_PUBLIC_BUG_EDGE_CASES, true),
  fakeDisabledButton: parseBool(process.env.NEXT_PUBLIC_BUG_FAKE_DISABLED_BUTTON, true)
};

export const qaModeEnabled = parseBool(process.env.NEXT_PUBLIC_ENABLE_QA_MODE, true);
