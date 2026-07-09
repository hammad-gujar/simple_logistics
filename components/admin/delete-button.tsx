"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminResult } from "@/lib/actions/admin";

interface DeleteButtonProps {
  /** Human-readable name of the record, shown in the confirmation. */
  label: string;
  action: () => Promise<AdminResult>;
  /** Consequence line in the confirmation dialog. */
  description?: string;
}

export function DeleteButton({
  label,
  action,
  description = "This permanently removes the record and unpublishes it from the site immediately. This cannot be undone.",
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const confirm = () => {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success("Deleted.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${label}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle className="font-display">Delete “{label}”?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="rounded-none" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="gap-2 rounded-none"
            onClick={confirm}
            disabled={pending}
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
