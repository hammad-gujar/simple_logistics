import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  Inbox,
  Layers,
  Users,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import type { ContactInquiryRow, WorkforceRequestRow } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const headCount = { count: "exact" as const, head: true };
  const [
    { count: publishedServices },
    { count: publishedJobs },
    { count: publishedPosts },
    { count: newInquiries },
    { count: newWorkforce },
    recentInquiries,
    recentWorkforce,
  ] = await Promise.all([
    supabase.from("services").select("*", headCount).eq("is_published", true),
    supabase.from("jobs").select("*", headCount).eq("is_published", true),
    supabase.from("posts").select("*", headCount).eq("is_published", true),
    supabase.from("contact_inquiries").select("*", headCount).eq("status", "new"),
    supabase.from("workforce_requests").select("*", headCount).eq("status", "new"),
    supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .then((r) => (r.data as ContactInquiryRow[]) ?? []),
    supabase
      .from("workforce_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .then((r) => (r.data as WorkforceRequestRow[]) ?? []),
  ]);

  const stats = [
    {
      label: "Live services",
      value: publishedServices ?? 0,
      icon: Layers,
      href: "/admin/services/logistics",
      alert: false,
    },
    {
      label: "Live job listings",
      value: publishedJobs ?? 0,
      icon: BriefcaseBusiness,
      href: "/admin/jobs",
      alert: false,
    },
    {
      label: "Published posts",
      value: publishedPosts ?? 0,
      icon: FileText,
      href: "/admin/posts",
      alert: false,
    },
    {
      label: "Unread inquiries",
      value: newInquiries ?? 0,
      icon: Inbox,
      href: "/admin/inquiries",
      alert: (newInquiries ?? 0) > 0,
    },
    {
      label: "New workforce requests",
      value: newWorkforce ?? 0,
      icon: Users,
      href: "/admin/workforce",
      alert: (newWorkforce ?? 0) > 0,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Operational overview — live content, lead queues and the latest activity across both divisions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-border bg-card p-5 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="size-4 text-muted-foreground" aria-hidden />
              {stat.alert ? <span className="size-2 rounded-full bg-freight" aria-hidden /> : null}
            </div>
            <p className="mt-4 font-display text-4xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Workforce request queue */}
        <section className="border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Latest workforce requests
            </h2>
            <Link
              href="/admin/workforce"
              className="inline-flex items-center gap-1 text-xs font-semibold text-freight uppercase"
            >
              View all <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </header>
          {recentWorkforce.length ? (
            <ul className="divide-y divide-border">
              {recentWorkforce.map((req) => (
                <li key={req.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {req.company_name}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {req.headcount} × {req.roles_needed[0] ?? "workers"}
                        {req.roles_needed.length > 1 ? ` +${req.roles_needed.length - 1}` : ""}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {req.site_location} · {formatDateTime(req.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant={req.urgency === "critical" ? "destructive" : "secondary"}
                    className="shrink-0 rounded-none capitalize"
                  >
                    {req.urgency}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No workforce requests yet.
            </p>
          )}
        </section>

        {/* Inquiry queue */}
        <section className="border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Latest contact inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs font-semibold text-freight uppercase"
            >
              View all <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </header>
          {recentInquiries.length ? (
            <ul className="divide-y divide-border">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{inquiry.subject}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {inquiry.name} · {formatDateTime(inquiry.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant={inquiry.status === "new" ? "default" : "secondary"}
                    className="shrink-0 rounded-none capitalize"
                  >
                    {inquiry.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No inquiries yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
