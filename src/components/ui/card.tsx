import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

export const Card = ({ title, subtitle, className, children }: CardProps) => {
  return (
    <section className={cn("rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card", className)}>
      {title ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      <div className={cn(title ? "mt-4" : undefined)}>{children}</div>
    </section>
  );
};
