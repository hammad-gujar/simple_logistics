import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Banknote, CalendarClock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";
import { Reveal } from "@/components/site/reveal";
import { DivisionBadge } from "@/components/site/division-badge";
import { getJobBySlug, getJobs, getSettings } from "@/lib/queries";
import { buildMetadata, breadcrumbJsonLd, jobPostingJsonLd, JsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJobBySlug(slug), getSettings()]);
  if (!job) return {};
  return buildMetadata({
    settings,
    title: `${job.title} — ${job.location}`,
    description: job.summary,
    path: `/jobs/${slug}`,
  });
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJobBySlug(slug), getSettings()]);
  if (!job) notFound();

  // Application routing is fully admin-configured: per-job override first,
  // then the global settings engine, never hardcoded.
  const applicationEmail =
    job.application_email || settings.applications_email || settings.email || "";
  const applicationInstructions =
    job.application_instructions ||
    `Please quote Job ID ${job.reference} in your subject line and send your CV to the address below. Include your postcode and earliest available start date — our team replies to every application within one working day.`;

  const mailtoHref = applicationEmail
    ? `mailto:${applicationEmail}?subject=${encodeURIComponent(
        `Application — ${job.title} (Job ID ${job.reference})`,
      )}`
    : null;

  const facts = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: CalendarClock, label: "Contract", value: job.job_type },
    { icon: Building2, label: "Industry", value: job.industry },
    ...(job.salary_text
      ? [{ icon: Banknote, label: "Pay", value: job.salary_text }]
      : []),
  ];

  return (
    <>
      <JsonLd data={jobPostingJsonLd(job, settings)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: job.title, path: `/jobs/${job.slug}` },
        ])}
      />

      <PageHero
        kicker={`Vacancy — Ref ${job.reference}`}
        title={job.title}
        description={job.summary}
        division={job.division}
      >
        <Reveal delay={0.2}>
          <Link
            href="/jobs"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-paper/60 transition-colors hover:text-paper"
          >
            <ArrowLeft className="size-4" />
            All vacancies
          </Link>
        </Reveal>
      </PageHero>

      <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <RichText html={job.body_html} />
          </Reveal>

          {/* Application panel */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal className="lg:sticky lg:top-28">
              <div className="border border-border bg-card">
                <div className="border-b border-border p-6">
                  <div className="flex items-center justify-between gap-3">
                    <DivisionBadge division={job.division} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {job.reference}
                    </span>
                  </div>
                  <dl className="mt-5 space-y-3.5">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex items-start gap-3">
                        <fact.icon className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
                        <div>
                          <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {fact.label}
                          </dt>
                          <dd className="text-sm font-medium text-foreground">{fact.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                  {job.closes_at ? (
                    <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                      Applications close {formatDate(job.closes_at)}
                    </p>
                  ) : null}
                </div>

                <div className="p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    How to apply
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {applicationInstructions}
                  </p>
                  {applicationEmail ? (
                    <>
                      <p className="mt-4 border border-border bg-background px-4 py-3 text-center font-mono text-sm break-all text-foreground">
                        {applicationEmail}
                      </p>
                      {mailtoHref ? (
                        <Button asChild className="mt-4 w-full gap-2 rounded-none" size="lg">
                          <a href={mailtoHref}>
                            <Mail className="size-4" />
                            Email your application
                          </a>
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    No document upload needed — a CV attached to your email is all we ask.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </article>
    </>
  );
}
