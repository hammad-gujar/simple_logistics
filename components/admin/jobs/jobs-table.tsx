"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DivisionBadge } from "@/components/site/division-badge";
import { deleteJob } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/utils";
import type { JobRow } from "@/lib/types";

const columns: ColumnDef<JobRow>[] = [
  {
    accessorKey: "title",
    header: "Role",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {row.original.reference} · {row.original.location}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => <DivisionBadge division={row.original.division} />,
  },
  { accessorKey: "job_type", header: "Type" },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_published ? (
        <Badge className="rounded-none bg-care text-white">Live</Badge>
      ) : (
        <Badge variant="secondary" className="rounded-none">
          Draft
        </Badge>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Posted",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateTime(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button asChild variant="ghost" size="icon" className="size-8">
          <Link href={`/admin/jobs/${row.original.id}`} aria-label={`Edit ${row.original.title}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <DeleteButton label={row.original.title} action={deleteJob.bind(null, row.original.id)} />
      </div>
    ),
  },
];

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={jobs}
      searchPlaceholder="Search jobs, references, locations…"
      emptyMessage="No job listings yet — post the first vacancy."
    />
  );
}
