import { AdminPageHeader } from "@/components/admin/page-header";
import { WorkforceTable } from "@/components/admin/leads/workforce-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WorkforceRequestRow } from "@/lib/types";

export default async function AdminWorkforcePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("workforce_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Workforce requests"
        description="Structured B2B staffing requests from the multi-step form — the logistics division's lead queue."
      />
      <WorkforceTable requests={(data as WorkforceRequestRow[]) ?? []} />
    </>
  );
}
