import { AdminPageHeader } from "@/components/admin/page-header";
import { PostsTable } from "@/components/admin/posts/posts-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/types";

export default async function AdminPostsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Blog posts"
        description="Insights and industry notes. Tags and categories drive the related-article algorithm on the public site."
        action={{ href: "/admin/posts/new", label: "New post" }}
      />
      <PostsTable posts={(data as PostRow[]) ?? []} />
    </>
  );
}
