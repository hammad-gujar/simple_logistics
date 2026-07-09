import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RichText } from "@/components/site/rich-text";
import { PostCard } from "@/components/site/post-card";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { getPostBySlug, getPosts, getRelatedPosts, getSettings } from "@/lib/queries";
import { blogPostingJsonLd, breadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) return {};
  return buildMetadata({
    settings,
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.cover_image_url,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post, settings)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article>
        {/* Editorial masthead */}
        <header className="relative overflow-hidden bg-ink-deeper">
          <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-18">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[0.6875rem] tracking-[0.18em] text-paper/55 uppercase">
                <span className="text-freight-soft">{post.category}</span>
                <span aria-hidden>—</span>
                <time dateTime={post.published_at ?? post.created_at}>
                  {formatDate(post.published_at ?? post.created_at)}
                </time>
              </div>
              <h1 className="mt-6 font-display text-3xl leading-[1.12] font-semibold text-paper text-balance sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-paper/70">{post.excerpt}</p>
              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-paper/60 transition-colors hover:text-paper"
              >
                <ArrowLeft className="size-4" />
                All insights
              </Link>
            </Reveal>
          </div>
        </header>

        {post.cover_image_url ? (
          <div className="mx-auto -mt-2 max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative aspect-[16/8] -translate-y-8 overflow-hidden border border-border shadow-lg">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 56rem, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <RichText html={post.body_html} />
          {post.tags.length ? (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6" aria-label="Tags">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-border bg-card px-3 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-border bg-paper-deep">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="kicker text-freight">Keep reading</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
                Related insights
              </h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <PostCard post={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Put this thinking to work on your site."
        description="Whether it's peak planning or safe staffing, our divisional desks turn advice into rotas. Start with a conversation."
        primary={{ href: "/workforce-request", label: "Request workforce" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
