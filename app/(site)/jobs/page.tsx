import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";
import { JobCard } from "@/components/site/job-card";
import { JobFilters } from "@/components/site/jobs/job-filters";
import { CtaBand } from "@/components/site/cta-band";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { getJobs, getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { JobRow } from "@/lib/types";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
    industry?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: "Careers & Current Vacancies",
    description:
      "Driving, warehousing and healthcare roles across the UK. Weekly pay, transparent rates and a team that answers the phone.",
    path: "/jobs",
  });
}

function applyFilters(
  jobs: JobRow[],
  filters: { q?: string; location?: string; type?: string; industry?: string },
): JobRow[] {
  const q = filters.q?.toLowerCase().trim();
  return jobs.filter((job) => {
    if (filters.location && job.location !== filters.location) return false;
    if (filters.type && job.job_type !== filters.type) return false;
    if (filters.industry && job.industry !== filters.industry) return false;
    if (q) {
      const haystack = `${job.title} ${job.summary} ${job.location} ${job.industry} ${job.reference}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const [jobs, filters] = await Promise.all([getJobs(), searchParams]);

  const filtered = applyFilters(jobs, filters);
  const locations = [...new Set(jobs.map((j) => j.location))].sort();
  const industries = [...new Set(jobs.map((j) => j.industry))].sort();
  const types = [...new Set(jobs.map((j) => j.job_type))];

  return (
    <>
      <PageHero
        kicker="Careers"
        title="Work that pays properly and starts promptly."
        description="Every role below is live and managed by a named consultant. No document uploads, no black holes — one email and you'll hear back within a working day."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Suspense>
          <JobFilters locations={locations} industries={industries} types={types} />
        </Suspense>

        <p className="mt-8 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase" role="status">
          {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
        </p>

        {filtered.length ? (
          <Stagger className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <StaggerItem key={job.id}>
                <JobCard job={job} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mt-10 border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl font-semibold text-foreground">
              No roles match those filters right now.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              New vacancies are published weekly. Clear the filters, or send us your details
              via the contact page and we&rsquo;ll get in touch when the right role opens.
            </p>
          </div>
        )}
      </section>

      <CtaBand
        title="Can't see the right role?"
        description="We register new candidates every week for driving, warehousing and care work across the UK. Introduce yourself and we'll match you as roles open."
        primary={{ href: "/contact", label: "Register your interest" }}
      />
    </>
  );
}
