import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PostRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, featured = false }: { post: PostRow; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_20px_45px_-25px_rgba(16,28,44,0.4)]"
    >
      {post.cover_image_url ? (
        <div className={`relative overflow-hidden ${featured ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span className="text-freight">{post.category}</span>
          <span aria-hidden>—</span>
          <time dateTime={post.published_at ?? post.created_at}>
            {formatDate(post.published_at ?? post.created_at)}
          </time>
        </div>
        <h3
          className={`mt-3.5 font-display font-semibold text-foreground text-balance ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-foreground">
          Read article
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
