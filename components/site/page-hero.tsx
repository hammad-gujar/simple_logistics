import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import type { Division } from "@/lib/types";

interface PageHeroProps {
  kicker: string;
  title: string;
  description?: string;
  division?: Division;
  children?: React.ReactNode;
}

/** Interior-page ink header band, tinted by division where relevant. */
export function PageHero({ kicker, title, description, division, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-deeper">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className={cn(
          "pointer-events-none absolute -top-36 right-[-8%] h-96 w-96 rounded-full blur-3xl",
          division === "healthcare" ? "bg-care/20" : "bg-freight/15",
        )}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-20">
        <Reveal>
          <p
            className={cn(
              "kicker",
              division === "healthcare" ? "text-care-soft" : "text-freight-soft",
            )}
          >
            {kicker}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] font-semibold text-paper text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
              {description}
            </p>
          ) : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
