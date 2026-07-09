"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusSelect } from "@/components/admin/leads/status-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteWorkforceRequest, updateWorkforceStatus } from "@/lib/actions/admin";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { WorkforceRequestRow, WorkforceStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "closed", label: "Closed" },
] as const satisfies readonly { value: WorkforceStatus; label: string }[];

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

const columns: ColumnDef<WorkforceRequestRow>[] = [
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.company_name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.original.contact_name} · {row.original.site_location}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "headcount",
    header: "Requirement",
    cell: ({ row }) => (
      <span className="text-sm">
        <span className="font-semibold text-foreground">{row.original.headcount}×</span>{" "}
        {row.original.roles_needed.slice(0, 2).join(", ")}
        {row.original.roles_needed.length > 2 ? ` +${row.original.roles_needed.length - 2}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "urgency",
    header: "Urgency",
    cell: ({ row }) => (
      <Badge
        variant={row.original.urgency === "critical" ? "destructive" : "secondary"}
        className="rounded-none capitalize"
      >
        {row.original.urgency}
      </Badge>
    ),
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
        action={(status) => updateWorkforceStatus(row.original.id, status)}
      />
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <WorkforceDialog req={row.original} />
        <DeleteButton
          label={`Request from ${row.original.company_name}`}
          description="This permanently removes the workforce request from the lead queue. This cannot be undone."
          action={deleteWorkforceRequest.bind(null, row.original.id)}
        />
      </div>
    ),
  },
];

function WorkforceDialog({ req }: { req: WorkforceRequestRow }) {
  return (
    <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label="View request">
              <Eye className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto rounded-none sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">{req.company_name}</DialogTitle>
              <DialogDescription>
                Workforce request · {formatDateTime(req.created_at)}
              </DialogDescription>
            </DialogHeader>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <Detail label="Contact" value={req.contact_name} />
              <Detail
                label="Email"
                value={
                  <a href={`mailto:${req.email}`} className="text-freight hover:underline">
                    {req.email}
                  </a>
                }
              />
              <Detail label="Phone" value={req.phone} />
              <Detail label="Sector" value={req.sector} />
              <Detail label="Site location" value={req.site_location} />
              <Detail label="Headcount" value={req.headcount} />
              <Detail label="Roles" value={req.roles_needed.join(", ")} />
              <Detail label="Shift pattern" value={req.shift_pattern} />
              <Detail
                label="Start date"
                value={req.start_date ? formatDate(req.start_date) : "Flexible"}
              />
              <Detail label="Duration" value={req.duration} />
              <Detail label="Urgency" value={<span className="capitalize">{req.urgency}</span>} />
              <Detail label="Specialised skills" value={req.skills} />
            </dl>
            {req.notes ? (
              <div className="border-t border-border pt-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">Notes</p>
                <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
                  {req.notes}
                </p>
              </div>
            ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function WorkforceTable({ requests }: { requests: WorkforceRequestRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={requests}
      searchPlaceholder="Search companies, locations…"
      emptyMessage="No workforce requests yet."
    />
  );
}
