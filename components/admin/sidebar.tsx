"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  HeartPulse,
  BriefcaseBusiness,
  Newspaper,
  Quote,
  Inbox,
  Users,
  Settings,
  UserRound,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/services/logistics", label: "Logistics services", icon: Truck },
      { href: "/admin/services/healthcare", label: "Healthcare services", icon: HeartPulse },
      { href: "/admin/jobs", label: "Job listings", icon: BriefcaseBusiness },
      { href: "/admin/posts", label: "Blog posts", icon: Newspaper },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    ],
  },
  {
    heading: "Leads",
    items: [
      { href: "/admin/inquiries", label: "Contact inquiries", icon: Inbox },
      { href: "/admin/workforce", label: "Workforce requests", icon: Users },
    ],
  },
  {
    heading: "Configuration",
    items: [
      { href: "/admin/settings", label: "Global settings", icon: Settings },
      { href: "/admin/account", label: "Account", icon: UserRound },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper p-1">
          <Image
            src="/log_without_name.png"
            alt=""
            width={30}
            height={30}
            className="size-7 object-contain"
          />
        </span>
        <span className="font-display text-lg font-semibold text-white">Admin Portal</span>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6" aria-label="Admin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            <p className="px-3 font-mono text-[0.625rem] font-medium tracking-[0.22em] text-sidebar-foreground/45 uppercase">
              {section.heading}
            </p>
            <ul className="mt-2 space-y-0.5">
              {section.items.map((item) => {
                const active =
                  "exact" in item && item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors",
                        active
                          ? "border-freight bg-sidebar-accent font-medium text-white"
                          : "border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-2 text-xs text-sidebar-foreground/60 transition-colors hover:text-white"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          View public site
        </Link>
      </div>
    </aside>
  );
}
