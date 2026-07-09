"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { upsertPost } from "@/lib/actions/admin";
import { postSchema, type PostInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { PostRow } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function PostForm({ post }: { post?: PostRow }) {
  const router = useRouter();
  const [tagDraft, setTagDraft] = useState("");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          body_html: post.body_html,
          cover_image_url: post.cover_image_url ?? "",
          category: post.category,
          tags: post.tags,
          meta_title: post.meta_title ?? "",
          meta_description: post.meta_description ?? "",
          is_published: post.is_published,
        }
      : {
          slug: "",
          title: "",
          excerpt: "",
          body_html: "",
          cover_image_url: "",
          category: "",
          tags: [],
          meta_title: "",
          meta_description: "",
          is_published: false,
        },
  });

  const tags = watch("tags");

  const addTag = () => {
    const value = tagDraft.trim().toLowerCase();
    if (!value) return;
    if (!tags.includes(value)) {
      setValue("tags", [...tags, value], { shouldValidate: true });
    }
    setTagDraft("");
  };

  const onSubmit = async (values: PostInput) => {
    const result = await upsertPost(values);
    if (result.success) {
      toast.success(post ? "Post updated." : "Post created.");
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <section className="space-y-5 border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                className="mt-2 rounded-none"
                {...register("title")}
                onBlur={() => {
                  if (!post && !getValues("slug")) {
                    setValue("slug", slugify(getValues("title")));
                  }
                }}
              />
              <FieldError message={errors.title?.message} />
            </div>
            <div>
              <Label htmlFor="post-slug">URL slug</Label>
              <Input id="post-slug" className="mt-2 rounded-none font-mono" {...register("slug")} />
              <FieldError message={errors.slug?.message} />
            </div>
          </div>
          <div>
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea id="post-excerpt" rows={3} className="mt-2 rounded-none" {...register("excerpt")} />
            <FieldError message={errors.excerpt?.message} />
          </div>
          <div>
            <Label>Article content</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="body_html"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write the article…"
                  />
                )}
              />
            </div>
            <FieldError message={errors.body_html?.message} />
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Publishing</h2>
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                <Label htmlFor="post-published" className="cursor-pointer">
                  Published
                </Label>
                <Switch id="post-published" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          <div>
            <Label htmlFor="post-category">Category</Label>
            <Input
              id="post-category"
              placeholder="Logistics / Healthcare / Insights"
              className="mt-2 rounded-none"
              {...register("category")}
            />
            <FieldError message={errors.category?.message} />
          </div>
          <div>
            <Label htmlFor="post-cover">
              Cover image URL <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="post-cover"
              type="url"
              placeholder="https://…"
              className="mt-2 rounded-none"
              {...register("cover_image_url")}
            />
            <FieldError message={errors.cover_image_url?.message} />
          </div>
          <div>
            <Label htmlFor="post-tags">Tags (drive related-article matching)</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="post-tags"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag, press Enter"
                className="rounded-none"
              />
              <Button type="button" variant="outline" className="rounded-none" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-[0.6875rem] uppercase"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove tag ${tag}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setValue(
                          "tags",
                          tags.filter((t) => t !== tag),
                          { shouldValidate: true },
                        )
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <FieldError message={errors.tags?.message} />
          </div>
        </section>

        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">SEO</h2>
          <div>
            <Label htmlFor="post-meta-title">Meta title</Label>
            <Input id="post-meta-title" className="mt-2 rounded-none" {...register("meta_title")} />
            <FieldError message={errors.meta_title?.message} />
          </div>
          <div>
            <Label htmlFor="post-meta-desc">Meta description</Label>
            <Textarea
              id="post-meta-desc"
              rows={3}
              className="mt-2 rounded-none"
              {...register("meta_description")}
            />
            <FieldError message={errors.meta_description?.message} />
          </div>
        </section>

        <Button type="submit" size="lg" className="w-full gap-2 rounded-none" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {isSubmitting ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
