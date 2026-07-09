import { Counter } from "@/components/site/counter";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";

const STATS = [
  { value: 340, suffix: "+", label: "Client sites served across the UK" },
  { value: 98, suffix: "%", label: "Average shift fill rate in 2025" },
  { value: 11, suffix: "yrs", label: "Combined divisional track record" },
  { value: 96, suffix: "%", label: "Clients who rebook within 12 months" },
];

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-ink-deep">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="kicker text-freight-soft">02 — By the numbers</p>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div
                className={`border-l pl-6 ${i % 2 === 0 ? "border-freight/60" : "border-care-soft/60"}`}
              >
                <p className="font-display text-5xl font-semibold text-paper lg:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-paper/60">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
