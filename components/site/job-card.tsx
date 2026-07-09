import Link from "next/link";
import { ArrowUpRight, MapPin, Banknote } from "lucide-react";
import { DivisionBadge } from "@/components/site/division-badge";
import type { JobRow } from "@/lib/types";

export function JobCard({ job }: { job: JobRow }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group relative flex h-full flex-col border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_20px_45px_-25px_rgba(16,28,44,0.4)]"
    >
      <div className="flex items-start justify-between gap-3">
        <DivisionBadge division={job.division} />
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {job.reference}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-foreground text-balance">
        {job.title}
      </h3>
      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {job.summary}
      </p>

      <div className="mt-auto space-y-3 pt-6">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            {job.location}
          </span>
          {job.salary_text ? (
            <span className="inline-flex items-center gap-1.5">
              <Banknote className="size-3.5" aria-hidden />
              {job.salary_text}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {job.job_type} · {job.industry}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            View role
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
