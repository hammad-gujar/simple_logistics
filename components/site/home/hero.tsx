"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/site/counter";

const EASE = [0.22, 1, 0.36, 1] as const;

const TICKER_ROLES = [
  "HGV Class 1 Drivers",
  "Care Assistants",
  "Warehouse Operatives",
  "Registered Nurses",
  "Reach Truck Drivers",
  "Support Workers",
  "Multi-drop Couriers",
  "Deputy Managers",
  "Shift Supervisors",
  "Domiciliary Carers",
];

const HERO_STATS = [
  { value: 98, suffix: "%", label: "Shift fill rate, 2025" },
  { value: 1400, suffix: "+", label: "Workers deployed weekly" },
  { value: 24, suffix: "hr", label: "Priority deployment" },
];

// Deterministic SSR markup — reduced motion is handled by the
// [data-motion-reveal] CSS override in globals.css, never by JS branches.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-ink-deeper">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      {/* Division glows — amber upper left, teal lower right */}
      <div
        className="pointer-events-none absolute -top-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-freight/[0.13] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-48 h-[26rem] w-[26rem] rounded-full bg-care/[0.18] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Headline block */}
          <div className="lg:col-span-8">
            <motion.p data-motion-reveal {...rise(0)} className="kicker text-freight-soft">
              UK workforce partner — two divisions, one standard
            </motion.p>

            <motion.h1
              data-motion-reveal
              {...rise(0.12)}
              className="mt-6 font-display text-[2.6rem] leading-[1.06] font-semibold text-paper text-balance sm:text-6xl lg:text-[4.4rem]"
            >
              The people behind Britain&rsquo;s{" "}
              <span className="relative whitespace-nowrap text-freight-soft">
                supply chains
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  viewBox="0 0 300 10"
                  fill="none"
                  aria-hidden
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 7C60 2.5 180 2 298 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
                  />
                </svg>
              </span>{" "}
              and <span className="text-care-soft">care homes</span>.
            </motion.h1>

            <motion.p
              data-motion-reveal
              {...rise(0.24)}
              className="mt-7 max-w-xl text-lg leading-relaxed text-paper/70"
            >
              Simple Logistics Limited supplies vetted drivers, warehouse teams and
              healthcare professionals to organisations across the UK — compliance done
              properly, cover delivered on time, every time.
            </motion.p>

            <motion.div data-motion-reveal {...rise(0.36)} className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="group gap-1.5 rounded-none bg-freight px-7 text-ink-deeper hover:bg-freight-soft"
              >
                <Link href="/workforce-request">
                  Request workforce
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group gap-1.5 rounded-none border-paper/25 bg-transparent px-7 text-paper hover:bg-paper/10 hover:text-paper"
              >
                <Link href="/jobs">
                  Find work
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Stat rail */}
          <motion.aside
            data-motion-reveal
            {...rise(0.5)}
            className="flex gap-8 border-t border-paper/15 pt-8 lg:col-span-3 lg:col-start-10 lg:flex-col lg:gap-0 lg:space-y-8 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-10"
            aria-label="Key performance figures"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-semibold text-paper lg:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-sm text-paper/55">{stat.label}</p>
              </div>
            ))}
          </motion.aside>
        </div>
      </div>

      {/* Role ticker */}
      <motion.div
        data-motion-reveal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="relative border-t border-paper/10"
      >
        <div
          className="mx-auto flex max-w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          aria-hidden
        >
          <div className="flex animate-ticker">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center">
                {TICKER_ROLES.map((role, i) => (
                  <li
                    key={role}
                    className="flex items-center gap-6 pr-6 font-mono text-[0.75rem] tracking-[0.18em] whitespace-nowrap text-paper/45 uppercase"
                  >
                    {role}
                    <span
                      className={`h-1 w-1 ${i % 2 === 0 ? "bg-freight" : "bg-care-soft"}`}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
