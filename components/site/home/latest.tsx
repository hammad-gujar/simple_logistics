import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Stagger, StaggerItem, Reveal } from "@/components/site/reveal";
import { JobCard } from "@/components/site/job-card";
import { PostCard } from "@/components/site/post-card";
import type { JobRow, PostRow } from "@/lib/types";

/** Cross-linked previews of the latest vacancies and insights. */
export function LatestSection({ jobs, posts }: { jobs: JobRow[]; posts: PostRow[] }) {
  if (!jobs.length && !posts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Latest roles */}
        {jobs.length ? (
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                index="04"
                kicker="Now hiring"
                title="Latest roles"
                className="max-w-md"
              />
              <Reveal delay={0.1}>
                <Link
                  href="/jobs"
                  className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-freight uppercase transition-colors hover:text-ink"
                >
                  All vacancies
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
              {jobs.slice(0, 4).map((job) => (
                <StaggerItem key={job.id}>
                  <JobCard job={job} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}

        {/* Latest insights */}
        {posts.length ? (
          <div className={jobs.length ? "lg:col-span-5" : "lg:col-span-12"}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                index="05"
                kicker="Insights"
                title="From the desk"
                className="max-w-md"
              />
              <Reveal delay={0.1}>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-freight uppercase transition-colors hover:text-ink"
                >
                  All insights
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <Stagger className="mt-10 grid gap-5">
              {posts.slice(0, 2).map((post) => (
                <StaggerItem key={post.id}>
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}
      </div>
    </section>
  );
}
