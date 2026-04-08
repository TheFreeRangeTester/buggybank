"use client";

import type { ReactNode } from "react";
import { QaProvider } from "@/components/qa/qa-provider";

export const QaRootProvider = ({ children }: { children: ReactNode }) => {
  return <QaProvider>{children}</QaProvider>;
};
