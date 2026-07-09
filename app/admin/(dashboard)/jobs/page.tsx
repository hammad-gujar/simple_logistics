import { AdminPageHeader } from "@/components/admin/page-header";
import { JobsTable } from "@/components/admin/jobs/jobs-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobRow } from "@/lib/types";

export default async function AdminJobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Job listings"
        description="Vacancies across both divisions. Live listings are indexable and emit JobPosting structured data automatically."
        action={{ href: "/admin/jobs/new", label: "New job" }}
      />
      <JobsTable jobs={(data as JobRow[]) ?? []} />
    </>
  );
}
