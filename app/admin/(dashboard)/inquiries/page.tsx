import { AdminPageHeader } from "@/components/admin/page-header";
import { InquiriesTable } from "@/components/admin/leads/inquiries-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContactInquiryRow } from "@/lib/types";

export default async function AdminInquiriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Contact inquiries"
        description="Every message from the public contact form, tracked through New → In review → Closed."
      />
      <InquiriesTable inquiries={(data as ContactInquiryRow[]) ?? []} />
    </>
  );
}
