import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type StatCardProps = {
  title: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "positive" | "warning";
};

export const StatCard = ({ title, value, helper, tone = "neutral" }: StatCardProps) => {
  return (
    <Card className="h-full" subtitle={helper} title={title}>
      <p
        className={cn(
          "text-2xl font-semibold tracking-tight",
          tone === "neutral" && "text-slate-900",
          tone === "positive" && "text-emerald-700",
          tone === "warning" && "text-amber-700"
        )}
      >
        {value}
      </p>
    </Card>
  );
};
