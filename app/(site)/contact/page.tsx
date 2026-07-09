import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    settings,
    title: "Contact Us",
    description: `Speak to the ${settings.site_name} team about logistics workforce supply, healthcare staffing or current vacancies.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSettings();
  const addressParts = [
    settings.address_line1,
    settings.address_line2,
    settings.city,
    settings.postcode,
    settings.country,
  ].filter(Boolean);

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Real people, one working day."
        description="Every enquiry lands with a named member of the team — not a shared inbox nobody owns. Expect a reply within one working day, usually much faster."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Contact details rail */}
          <Reveal className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              <div className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-freight" aria-hidden />
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Head office
                  </h2>
                  <address className="mt-2 text-sm leading-relaxed text-muted-foreground not-italic">
                    {addressParts.map((part) => (
                      <span key={part} className="block">
                        {part}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              {settings.phone ? (
                <div className="flex gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-freight" aria-hidden />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Phone</h2>
                    <a
                      href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                      className="mt-2 block font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {settings.contact_email || settings.email ? (
                <div className="flex gap-4">
                  <Mail className="mt-1 size-5 shrink-0 text-freight" aria-hidden />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Email</h2>
                    <a
                      href={`mailto:${settings.contact_email ?? settings.email}`}
                      className="mt-2 block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {settings.contact_email ?? settings.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {settings.opening_hours.length ? (
                <div className="flex gap-4">
                  <Clock className="mt-1 size-5 shrink-0 text-freight" aria-hidden />
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Opening hours
                    </h2>
                    <dl className="mt-2 space-y-1.5 text-sm">
                      {settings.opening_hours.map((slot) => (
                        <div key={slot.days} className="flex justify-between gap-6">
                          <dt className="text-muted-foreground">{slot.days}</dt>
                          <dd className="font-mono text-[0.8125rem] text-foreground">
                            {slot.hours}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.12} className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
