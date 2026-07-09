import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { RichText } from "@/components/site/rich-text";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { getServiceBySlug, getServices, getSettings } from "@/lib/queries";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import { DIVISIONS, type Division } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ServicePageProps {
  params: Promise<{ division: string; slug: string }>;
}

function isDivision(value: string): value is Division {
  return (DIVISIONS as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ division: s.division, slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { division, slug } = await params;
  if (!isDivision(division)) return {};
  const [service, settings] = await Promise.all([
    getServiceBySlug(division, slug),
    getSettings(),
  ]);
  if (!service) return {};
  return buildMetadata({
    settings,
    title: service.meta_title ?? service.title,
    description: service.meta_description ?? service.excerpt,
    path: `/services/${division}/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { division, slug } = await params;
  if (!isDivision(division)) notFound();

  const service = await getServiceBySlug(division, slug);
  if (!service) notFound();

  const divisionLabel = division === "logistics" ? "Logistics" : "Healthcare";
  const accent = division === "logistics" ? "freight" : "care";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${divisionLabel} Services`, path: `/services/${division}` },
          { name: service.title, path: `/services/${division}/${service.slug}` },
        ])}
      />
      {service.faqs.length ? <JsonLd data={faqJsonLd(service.faqs)} /> : null}

      <PageHero
        kicker={`${divisionLabel} — Service`}
        title={service.title}
        description={service.excerpt}
        division={division}
      >
        <Reveal delay={0.2}>
          <Link
            href={`/services/${division}`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-paper/60 transition-colors hover:text-paper"
          >
            <ArrowLeft className="size-4" />
            All {divisionLabel.toLowerCase()} services
          </Link>
        </Reveal>
      </PageHero>

      <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Body copy */}
          <Reveal className="lg:col-span-7">
            <RichText html={service.body_html} />
          </Reveal>

          {/* Benefits rail */}
          {service.benefits.length ? (
            <aside className="lg:col-span-4 lg:col-start-9" aria-label="Key benefits">
              <Stagger className="space-y-5 lg:sticky lg:top-28">
                {service.benefits.map((benefit, i) => (
                  <StaggerItem key={benefit.title}>
                    <div
                      className={cn(
                        "border-l-2 bg-card p-6",
                        accent === "freight" ? "border-freight" : "border-care",
                      )}
                    >
                      <p className="font-mono text-[0.6875rem] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </aside>
          ) : null}
        </div>

        {/* FAQs */}
        {service.faqs.length ? (
          <Reveal className="mt-20 max-w-3xl">
            <p className={cn("kicker", accent === "freight" ? "text-freight" : "text-care")}>
              Frequently asked
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
              Questions we hear about {service.title.toLowerCase()}
            </h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-foreground transition-colors hover:text-freight [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <Plus
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-5 leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ) : null}
      </article>

      <CtaBand
        title={`Need ${divisionLabel.toLowerCase()} support on the ground?`}
        description="Send a structured request and the divisional desk will respond within one working hour with availability, rates and next steps."
        primary={{ href: "/workforce-request", label: "Request workforce" }}
        secondary={{ href: "/contact", label: "Ask a question" }}
      />
    </>
  );
}
