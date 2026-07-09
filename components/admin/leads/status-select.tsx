"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminResult } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

interface StatusSelectProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  action: (status: T) => Promise<AdminResult>;
}

/** Inline status workflow control used in the lead tables. */
export function StatusSelect<T extends string>({ value, options, action }: StatusSelectProps<T>) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (!next) return;
        startTransition(async () => {
          const result = await action(next as T);
          if (result.success) {
            router.refresh();
          } else {
            toast.error(result.error);
          }
        });
      }}
      disabled={pending}
    >
      <SelectTrigger
        size="sm"
        className={cn("w-32 rounded-none text-xs", pending && "opacity-60")}
        aria-label="Update status"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
