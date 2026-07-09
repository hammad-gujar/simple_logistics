import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DIVISIONS, type Division, type ServiceRow } from "@/lib/types";

interface PageProps {
  params: Promise<{ division: string; id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { division, id } = await params;
  if (!(DIVISIONS as readonly string[]).includes(division)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const service = data as ServiceRow;

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${service.title}`}
        description="Changes to published services go live on the public site as soon as you save."
      />
      <ServiceForm division={division as Division} service={service} />
    </>
  );
}
