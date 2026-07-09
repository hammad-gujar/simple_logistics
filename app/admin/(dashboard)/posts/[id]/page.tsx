import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/posts/post-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const post = data as PostRow;

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${post.title}`}
        description="Changes to published posts go live on the public site as soon as you save."
      />
      <PostForm post={post} />
    </>
  );
}
