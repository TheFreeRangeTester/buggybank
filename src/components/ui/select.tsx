import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export const Select = ({ label, className, id, children, ...props }: SelectProps) => {
  return (
    <label className="block space-y-1" htmlFor={id}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        id={id}
        className={cn(
          "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};
