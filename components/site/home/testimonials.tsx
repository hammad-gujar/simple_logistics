import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { DivisionBadge } from "@/components/site/division-badge";
import type { TestimonialRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: TestimonialRow[] }) {
  if (!testimonials.length) return null;
  const [featured, ...rest] = testimonials;

  return (
    <section className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          index="03"
          kicker="Client voices"
          title="Trusted where it counts: on the shop floor and the care floor."
        />
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Featured quote — oversized editorial treatment */}
          <StaggerItem className="lg:col-span-7">
            <figure className="relative flex h-full flex-col justify-between border border-border bg-card p-8 sm:p-12">
              <Quote className="absolute top-8 right-8 size-10 text-freight/20" aria-hidden />
              <blockquote className="max-w-xl font-display text-2xl leading-snug font-medium text-foreground sm:text-[1.75rem]">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-5">
                <div>
                  <p className="font-semibold text-foreground">{featured.author_name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{featured.author_role}</p>
                </div>
                {featured.division ? <DivisionBadge division={featured.division} /> : null}
              </figcaption>
            </figure>
          </StaggerItem>

          {/* Supporting quotes */}
          <div className="grid gap-6 lg:col-span-5">
            {rest.slice(0, 2).map((t) => (
              <StaggerItem key={t.id}>
                <figure
                  className={cn(
                    "flex h-full flex-col justify-between border-l-2 bg-card p-7",
                    t.division === "healthcare" ? "border-care" : "border-freight",
                  )}
                >
                  <blockquote className="text-[0.9375rem] leading-relaxed text-foreground/85">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold text-foreground">{t.author_name}</span>
                    <span className="text-muted-foreground"> — {t.author_role}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
