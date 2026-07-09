import Link from "next/link";
import { ArrowRight, Truck, HeartPulse } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import type { Division, ServiceRow } from "@/lib/types";

interface DivisionPanelProps {
  division: Division;
  services: ServiceRow[];
  className?: string;
  delay?: number;
}

const DIVISION_COPY: Record<
  Division,
  { title: string; body: string; cta: string; fallbackLinks: Array<{ label: string; slug: string }> }
> = {
  logistics: {
    title: "Logistics Workforce",
    body: "Drivers, warehouse operatives and managed onsite teams for transport, distribution and fulfilment operations — deployed fast and compliance-checked before they reach your gate.",
    cta: "Explore logistics services",
    fallbackLinks: [
      { label: "HGV & LGV Driver Supply", slug: "hgv-driver-supply" },
      { label: "Warehouse & Distribution Staffing", slug: "warehouse-staffing" },
      { label: "Managed Workforce Programmes", slug: "managed-workforce" },
    ],
  },
  healthcare: {
    title: "Healthcare Staffing",
    body: "Care assistants, support workers and NMC-registered nurses for residential, supported living and community settings — vetted by people who understand care, not checklists.",
    cta: "Explore healthcare services",
    fallbackLinks: [
      { label: "Care Assistants & Support Workers", slug: "care-assistants" },
      { label: "Registered Nurses (RGN / RMN)", slug: "nursing-staff" },
      { label: "Emergency & Temporary Cover", slug: "temporary-cover" },
    ],
  },
};

function DivisionPanel({ division, services, className, delay = 0 }: DivisionPanelProps) {
  const copy = DIVISION_COPY[division];
  const isLogistics = division === "logistics";
  const Icon = isLogistics ? Truck : HeartPulse;
  const links = services.length
    ? services.slice(0, 3).map((s) => ({ label: s.title, slug: s.slug }))
    : copy.fallbackLinks;

  return (
    <Reveal delay={delay} className={className}>
      <article
        className={cn(
          "group/panel relative flex h-full flex-col border bg-card p-8 transition-shadow duration-300 hover:shadow-[0_24px_60px_-30px_rgba(16,28,44,0.35)] sm:p-10",
          isLogistics ? "border-freight/25" : "border-care/25",
        )}
      >
        {/* Corner accent */}
        <span
          className={cn(
            "absolute top-0 left-0 h-14 w-1 transition-all duration-300 group-hover/panel:h-24",
            isLogistics ? "bg-freight" : "bg-care",
          )}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-4">
          <p
            className={cn(
              "font-mono text-[0.6875rem] font-medium tracking-[0.22em] uppercase",
              isLogistics ? "text-freight" : "text-care",
            )}
          >
            Division {isLogistics ? "01" : "02"}
          </p>
          <Icon
            className={cn("size-7", isLogistics ? "text-freight" : "text-care")}
            strokeWidth={1.5}
            aria-hidden
          />
        </div>

        <h3 className="mt-5 font-display text-3xl font-semibold text-foreground">
          {copy.title}
        </h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{copy.body}</p>

        <ul className="mt-8 flex-1 space-y-0 border-t border-border">
          {links.map((link) => (
            <li key={link.slug} className="border-b border-border">
              <Link
                href={`/services/${division}/${link.slug}`}
                className="group/link flex items-center justify-between gap-4 py-3.5 text-[0.9375rem] font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
                <ArrowRight
                  className={cn(
                    "size-4 shrink-0 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100",
                    isLogistics ? "text-freight" : "text-care",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={`/services/${division}`}
          className={cn(
            "mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase transition-colors",
            isLogistics ? "text-freight hover:text-ink" : "text-care hover:text-ink",
          )}
        >
          {copy.cta}
          <ArrowRight className="size-4 transition-transform group-hover/panel:translate-x-1" />
        </Link>
      </article>
    </Reveal>
  );
}

export function DivisionSplit({
  logistics,
  healthcare,
}: {
  logistics: ServiceRow[];
  healthcare: ServiceRow[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading
        index="01"
        kicker="Our divisions"
        title="Two specialisms. One uncompromising standard."
        description="Most agencies bolt sectors together. We built two dedicated divisions — each with its own compliance team, candidate pool and on-call desk — under one accountable brand."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <DivisionPanel division="logistics" services={logistics} />
        <DivisionPanel
          division="healthcare"
          services={healthcare}
          delay={0.12}
          className="lg:translate-y-10"
        />
      </div>
    </section>
  );
}
