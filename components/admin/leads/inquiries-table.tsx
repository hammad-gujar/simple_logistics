"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusSelect } from "@/components/admin/leads/status-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteInquiry, updateInquiryStatus } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/utils";
import type { ContactInquiryRow, InquiryStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "closed", label: "Closed" },
] as const satisfies readonly { value: InquiryStatus; label: string }[];

const columns: ColumnDef<ContactInquiryRow>[] = [
  {
    accessorKey: "name",
    header: "From",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="line-clamp-1 max-w-64">{row.original.subject}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Received",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateTime(row.original.created_at)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusSelect
        value={row.original.status}
        options={STATUS_OPTIONS}
        action={(status) => updateInquiryStatus(row.original.id, status)}
      />
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <InquiryDialog row={row.original} />
        <DeleteButton
          label={`Inquiry from ${row.original.name}`}
          description="This permanently removes the inquiry from the lead queue. This cannot be undone."
          action={deleteInquiry.bind(null, row.original.id)}
        />
      </div>
    ),
  },
];

function InquiryDialog({ row }: { row: ContactInquiryRow }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label="View message">
          <Eye className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">{row.subject}</DialogTitle>
          <DialogDescription>
            {row.name} · {row.email}
            {row.phone ? ` · ${row.phone}` : ""} · {formatDateTime(row.created_at)}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
          {row.message}
        </p>
        <a
          href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject}`)}`}
          className="text-sm font-semibold text-freight hover:underline"
        >
          Reply by email →
        </a>
      </DialogContent>
    </Dialog>
  );
}

export function InquiriesTable({ inquiries }: { inquiries: ContactInquiryRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={inquiries}
      searchPlaceholder="Search names, subjects…"
      emptyMessage="No contact inquiries yet."
    />
  );
}
