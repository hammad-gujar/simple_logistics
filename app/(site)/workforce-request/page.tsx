import type { Metadata } from "next";
import { PhoneCall, ShieldCheck, Timer } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { WorkforceRequestForm } from "@/components/site/workforce-form";
import { Reveal } from "@/components/site/reveal";
import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: "Request Workforce",
    description:
      "Tell us your headcount, roles, shift pattern and start date — our logistics desk responds to every structured workforce request within one working hour.",
    path: "/workforce-request",
  });
}

const ASSURANCES = [
  {
    icon: Timer,
    title: "One-hour response",
    description:
      "Every request is acknowledged by a named consultant within one working hour — with availability, not an autoresponder.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance up front",
    description:
      "Licence, right-to-work and training evidence is packaged with every worker before they reach your site.",
  },
  {
    icon: PhoneCall,
    title: "A person, not a portal",
    description:
      "You'll deal with the same divisional desk from first call to final invoice. No ticket queues.",
  },
];

export default async function WorkforceRequestPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        kicker="For employers"
        title="Tell us what your operation needs. We'll staff it."
        description="Three short steps — your company, your requirement, your timeline. It takes under three minutes, and there's nothing to upload."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              {ASSURANCES.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <item.icon className="mt-1 size-5 shrink-0 text-freight" aria-hidden />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
              {settings.phone ? (
                <div className="border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">
                    Prefer to talk it through? Call the workforce desk:
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                    className="mt-2 block font-mono text-lg font-medium text-foreground transition-colors hover:text-freight"
                  >
                    {settings.phone}
                  </a>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2 lg:col-span-8">
            <WorkforceRequestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
