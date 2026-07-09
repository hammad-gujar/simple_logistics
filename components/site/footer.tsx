import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

const DIVISION_LINKS = [
  { href: "/services/logistics", label: "Logistics workforce" },
  { href: "/services/healthcare", label: "Healthcare staffing" },
  { href: "/workforce-request", label: "Request workforce" },
  { href: "/jobs", label: "Current vacancies" },
];

const COMPANY_LINKS = [
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact us" },
  { href: "/admin", label: "Client portal" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const addressParts = [
    settings.address_line1,
    settings.address_line2,
    settings.city,
    settings.postcode,
  ].filter(Boolean);

  return (
    <footer className="relative bg-ink-deeper text-paper/70">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3">
              {/* Paper chip keeps the navy half of the mark legible on ink */}
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper p-1.5">
                <Image
                  src="/log_without_name.png"
                  alt=""
                  width={40}
                  height={40}
                  className="size-9 object-contain"
                />
              </span>
              <span className="font-display text-2xl font-semibold text-paper">
                {settings.site_name}
              </span>
            </p>
            {settings.tagline ? (
              <p className="mt-4 max-w-sm text-sm leading-relaxed">{settings.tagline}</p>
            ) : null}
            <address className="mt-6 text-sm leading-relaxed not-italic">
              {addressParts.map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
              <span className="block">{settings.country}</span>
            </address>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-[0.6875rem] font-medium tracking-[0.22em] text-freight-soft uppercase">
              Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {DIVISION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[0.6875rem] font-medium tracking-[0.22em] text-freight-soft uppercase">
              Company
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / hours */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-[0.6875rem] font-medium tracking-[0.22em] text-freight-soft uppercase">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                    className="font-mono transition-colors hover:text-paper"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition-colors hover:text-paper"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
            </ul>
            {settings.opening_hours.length ? (
              <dl className="mt-6 space-y-1.5 border-t border-paper/10 pt-5 text-sm">
                {settings.opening_hours.map((slot) => (
                  <div key={slot.days} className="flex justify-between gap-4">
                    <dt className="text-paper/50">{slot.days}</dt>
                    <dd className="font-mono text-[0.8125rem]">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.site_name}. All rights reserved.
            {settings.companies_house_number
              ? ` Registered in England & Wales, Company No. ${settings.companies_house_number}.`
              : ""}
          </p>
          <div className="flex items-center gap-5">
            {settings.linkedin_url ? (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-paper"
              >
                LinkedIn
              </a>
            ) : null}
            {settings.facebook_url ? (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-paper"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
