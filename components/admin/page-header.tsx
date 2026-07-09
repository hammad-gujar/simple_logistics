import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action, children }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button asChild className="gap-2 rounded-none">
          <Link href={action.href}>
            <Plus className="size-4" aria-hidden />
            {action.label}
          </Link>
        </Button>
      ) : null}
      {children}
    </div>
  );
}
