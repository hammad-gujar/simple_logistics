import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

interface CtaBandProps {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}

/** Full-bleed ink call-to-action band used at the foot of content pages. */
export function CtaBand({ title, description, primary, secondary }: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-ink-deep">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-freight/15 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-paper text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">{description}</p>
        </Reveal>
        <Reveal delay={0.15} className="flex shrink-0 flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="group gap-1.5 rounded-none bg-freight px-7 text-ink-deeper hover:bg-freight-soft"
          >
            <Link href={primary.href}>
              {primary.label}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
          {secondary ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-paper/25 bg-transparent px-7 text-paper hover:bg-paper/10 hover:text-paper"
            >
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
