"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/utils";
import type { PostRow } from "@/lib/types";

const columns: ColumnDef<PostRow>[] = [
  {
    accessorKey: "title",
    header: "Post",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">/{row.original.slug}</p>
      </div>
    ),
  },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "tags",
    header: "Tags",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex max-w-56 flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <span
            key={tag}
            className="border border-border bg-background px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground uppercase"
          >
            {tag}
          </span>
        ))}
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
  {
    accessorKey: "published_at",
    header: "Published",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.published_at ? formatDateTime(row.original.published_at) : "—"}
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
          <Link href={`/admin/posts/${row.original.id}`} aria-label={`Edit ${row.original.title}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <DeleteButton label={row.original.title} action={deletePost.bind(null, row.original.id)} />
      </div>
    ),
  },
];

export function PostsTable({ posts }: { posts: PostRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={posts}
      searchPlaceholder="Search posts, categories…"
      emptyMessage="No blog posts yet — write the first one."
    />
  );
}
