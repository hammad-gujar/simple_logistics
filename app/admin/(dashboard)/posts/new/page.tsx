import { AdminPageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/posts/post-form";

export default function NewPostPage() {
  return (
    <>
      <AdminPageHeader
        title="New blog post"
        description="The publish date is stamped automatically the first time the post goes live."
      />
      <PostForm />
    </>
  );
}
