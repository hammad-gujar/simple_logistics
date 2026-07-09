import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServicesTable } from "@/components/admin/services/services-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DIVISIONS, type Division, type ServiceRow } from "@/lib/types";

interface PageProps {
  params: Promise<{ division: string }>;
}

export default async function AdminServicesPage({ params }: PageProps) {
  const { division } = await params;
  if (!(DIVISIONS as readonly string[]).includes(division)) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("division", division)
    .order("sort_order", { ascending: true });

  const label = division === "logistics" ? "Logistics" : "Healthcare";

  return (
    <>
      <AdminPageHeader
        title={`${label} services`}
        description={`CRUD panel for the ${label.toLowerCase()} division. Published services appear at /services/${division} within moments of saving.`}
        action={{
          href: `/admin/services/${division}/new`,
          label: "New service",
        }}
      />
      <ServicesTable services={(data as ServiceRow[]) ?? []} />
    </>
  );
}
