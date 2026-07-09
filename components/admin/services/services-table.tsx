"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteService } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/utils";
import type { ServiceRow } from "@/lib/types";

const columns: ColumnDef<ServiceRow>[] = [
  {
    accessorKey: "title",
    header: "Service",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          /{row.original.division}/{row.original.slug}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_published ? (
        <Badge className="rounded-none bg-care text-white">Published</Badge>
      ) : (
        <Badge variant="secondary" className="rounded-none">
          Draft
        </Badge>
      ),
  },
  { accessorKey: "sort_order", header: "Order" },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateTime(row.original.updated_at)}
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
          <Link
            href={`/admin/services/${row.original.division}/${row.original.id}`}
            aria-label={`Edit ${row.original.title}`}
          >
            <Pencil className="size-4" />
          </Link>
        </Button>
        <DeleteButton
          label={row.original.title}
          action={deleteService.bind(null, row.original.id)}
        />
      </div>
    ),
  },
];

export function ServicesTable({ services }: { services: ServiceRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={services}
      searchPlaceholder="Search services…"
      emptyMessage="No services yet — create the first one."
    />
  );
}
