import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { getServices, getSettings } from "@/lib/queries";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { DIVISIONS, type Division } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DivisionPageProps {
  params: Promise<{ division: string }>;
}

const HUB_COPY: Record<
  Division,
  { kicker: string; title: string; description: string; cta: { title: string; description: string } }
> = {
  logistics: {
    kicker: "Division 01 — Logistics",
    title: "Logistics workforce solutions that keep Britain moving.",
    description:
      "Drivers, warehouse teams, courier crews and fully managed onsite programmes — supplied with compliance evidenced up front and fill rates we put in writing.",
    cta: {
      title: "Scaling a site or covering a shortfall?",
      description:
        "Send a structured workforce request and our logistics desk will come back within one working hour with availability and rates.",
    },
  },
  healthcare: {
    kicker: "Division 02 — Healthcare",
    title: "Healthcare staffing with care at its core.",
    description:
      "Care assistants, support workers and NMC-registered nurses for residential, nursing and community settings — vetted by a nurse-led compliance team and matched for continuity.",
    cta: {
      title: "Rota gaps, new packages or permanent hires?",
      description:
        "Our healthcare on-call desk runs 06:00–22:00, seven days a week. Tell us what you need and we will respond the same day.",
    },
  },
};

function isDivision(value: string): value is Division {
  return (DIVISIONS as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return DIVISIONS.map((division) => ({ division }));
}

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const { division } = await params;
  if (!isDivision(division)) return {};
  const settings = await getSettings();
  const copy = HUB_COPY[division];
  return buildMetadata({
    settings,
    title:
      division === "logistics"
        ? "Logistics Workforce Solutions"
        : "Healthcare Staffing & Recruitment",
    description: copy.description,
    path: `/services/${division}`,
  });
}

export default async function DivisionHubPage({ params }: DivisionPageProps) {
  const { division } = await params;
  if (!isDivision(division)) notFound();

  const services = await getServices(division);
  const copy = HUB_COPY[division];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          {
            name: division === "logistics" ? "Logistics Services" : "Healthcare Services",
            path: `/services/${division}`,
          },
        ])}
      />
      <PageHero
        kicker={copy.kicker}
        title={copy.title}
        description={copy.description}
        division={division}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {services.length ? (
          <Stagger className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <StaggerItem
                key={service.id}
                className={cn(i % 2 === 1 && "md:translate-y-8")}
              >
                <Link
                  href={`/services/${division}/${service.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-28px_rgba(16,28,44,0.4)] sm:p-10",
                    division === "logistics"
                      ? "border-border hover:border-freight/50"
                      : "border-border hover:border-care/50",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0 left-0 h-10 w-1 transition-all duration-300 group-hover:h-20",
                      division === "logistics" ? "bg-freight" : "bg-care",
                    )}
                    aria-hidden
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-foreground text-balance">
                    {service.title}
                  </h2>
                  <p className="mt-3.5 flex-1 leading-relaxed text-muted-foreground">
                    {service.excerpt}
                  </p>
                  <span
                    className={cn(
                      "mt-7 inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase",
                      division === "logistics" ? "text-freight" : "text-care",
                    )}
                  >
                    View service
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="mx-auto max-w-lg text-center text-muted-foreground">
            Services for this division are being published. Contact our team for the full
            service catalogue in the meantime.
          </p>
        )}
      </section>

      <CtaBand
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ href: "/workforce-request", label: "Request workforce" }}
        secondary={{ href: "/contact", label: "Contact the team" }}
      />
    </>
  );
}
