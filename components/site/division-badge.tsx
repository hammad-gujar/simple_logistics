import { cn } from "@/lib/utils";
import type { Division } from "@/lib/types";

const LABELS: Record<Division, string> = {
  logistics: "Logistics",
  healthcare: "Healthcare",
};

export function DivisionBadge({
  division,
  className,
}: {
  division: Division;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase",
        division === "logistics" ? "text-freight" : "text-care",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5",
          division === "logistics" ? "bg-freight" : "bg-care",
        )}
        aria-hidden
      />
      {LABELS[division]}
    </span>
  );
}
