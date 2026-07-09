"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface HeaderProps {
  siteName: string;
  logoUrl: string | null;
  phone: string | null;
}

const NAV_LINKS = [
  { href: "/services/logistics", label: "Logistics" },
  { href: "/services/healthcare", label: "Healthcare" },
  { href: "/jobs", label: "Careers" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

function Wordmark({ siteName, logoUrl }: { siteName: string; logoUrl: string | null }) {
  // An admin-uploaded logo from Settings overrides the built-in lockup.
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={siteName}
        width={168}
        height={40}
        className="h-9 w-auto"
        priority
      />
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/log_without_name.png"
        alt=""
        width={44}
        height={44}
        className="size-10 shrink-0 object-contain"
        priority
      />
      <span className="font-display text-xl font-semibold tracking-tight text-foreground">
        {siteName.replace(/\s*Limited\s*$/i, "")}
        <span className="ml-1.5 font-mono text-[0.625rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Ltd
        </span>
      </span>
    </span>
  );
}

export function SiteHeader({ siteName, logoUrl, phone }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/90 shadow-[0_1px_0_0_var(--border)] backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <Link href="/" aria-label={`${siteName} — home`} className="shrink-0">
          <Wordmark siteName={siteName} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left bg-freight transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="font-mono text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {phone}
            </a>
          ) : null}
          <Button asChild className="group gap-1.5 rounded-none px-5">
            <Link href="/workforce-request">
              Request workforce
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-background">
            <SheetHeader>
              <SheetTitle className="text-left font-display">{siteName}</SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col px-4" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "border-b border-border py-4 font-display text-lg font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "text-freight"
                      : "text-foreground hover:text-freight",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-6 rounded-none">
                <Link href="/workforce-request" onClick={() => setMobileOpen(false)}>
                  Request workforce
                </Link>
              </Button>
              {phone ? (
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="mt-6 text-center font-mono text-sm text-muted-foreground"
                >
                  {phone}
                </a>
              ) : null}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
