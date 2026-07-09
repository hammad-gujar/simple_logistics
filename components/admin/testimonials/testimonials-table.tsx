"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DivisionBadge } from "@/components/site/division-badge";
import { deleteTestimonial } from "@/lib/actions/admin";
import type { TestimonialRow } from "@/lib/types";

const columns: ColumnDef<TestimonialRow>[] = [
  {
    accessorKey: "quote",
    header: "Quote",
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-md text-sm text-foreground/85">
        &ldquo;{row.original.quote}&rdquo;
      </p>
    ),
  },
  {
    accessorKey: "author_name",
    header: "Author",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.author_name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{row.original.author_role}</p>
      </div>
    ),
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) =>
      row.original.division ? <DivisionBadge division={row.original.division} /> : "—",
  },
  { accessorKey: "sort_order", header: "Order" },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_published ? (
        <Badge className="rounded-none bg-care text-white">Published</Badge>
      ) : (
        <Badge variant="secondary" className="rounded-none">
          Hidden
        </Badge>
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
            href={`/admin/testimonials/${row.original.id}`}
            aria-label={`Edit testimonial from ${row.original.author_name}`}
          >
            <Pencil className="size-4" />
          </Link>
        </Button>
        <DeleteButton
          label={`Testimonial — ${row.original.author_name}`}
          action={deleteTestimonial.bind(null, row.original.id)}
        />
      </div>
    ),
  },
];

export function TestimonialsTable({ testimonials }: { testimonials: TestimonialRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={testimonials}
      searchPlaceholder="Search testimonials…"
      emptyMessage="No testimonials yet."
    />
  );
}
