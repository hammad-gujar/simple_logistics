import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { getPosts, getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: "Insights & Industry Notes",
    description:
      "Practical thinking on workforce planning, compliance and recruitment across UK logistics and healthcare.",
    path: "/blog",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        kicker="Insights"
        title="Notes from both sides of the workforce."
        description="Workforce planning, compliance and recruitment practice — written by the people who run our logistics and healthcare desks, not a content agency."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {posts.length ? (
          <>
            {featured ? (
              <Stagger className="grid gap-6 lg:grid-cols-12">
                <StaggerItem className="lg:col-span-8">
                  <PostCard post={featured} featured />
                </StaggerItem>
                {rest[0] ? (
                  <StaggerItem className="lg:col-span-4">
                    <PostCard post={rest[0]} />
                  </StaggerItem>
                ) : null}
              </Stagger>
            ) : null}
            {rest.length > 1 ? (
              <Stagger className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.slice(1).map((post) => (
                  <StaggerItem key={post.id}>
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}
          </>
        ) : (
          <div className="border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl font-semibold text-foreground">
              Articles are on their way.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Our first insights on workforce planning and compliance are being published —
              check back shortly.
            </p>
          </div>
        )}
      </section>

      <CtaBand
        title="Prefer answers to articles?"
        description="If you're weighing up a staffing decision right now, skip the reading list — our divisional leads are happy to talk it through."
        primary={{ href: "/contact", label: "Talk to our team" }}
      />
    </>
  );
}
