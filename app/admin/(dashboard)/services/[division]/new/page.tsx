import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { DIVISIONS, type Division } from "@/lib/types";

interface PageProps {
  params: Promise<{ division: string }>;
}

export default async function NewServicePage({ params }: PageProps) {
  const { division } = await params;
  if (!(DIVISIONS as readonly string[]).includes(division)) notFound();

  const label = division === "logistics" ? "Logistics" : "Healthcare";

  return (
    <>
      <AdminPageHeader
        title={`New ${label.toLowerCase()} service`}
        description="Drafts stay hidden from the public site until you flip the Published switch."
      />
      <ServiceForm division={division as Division} />
    </>
  );
}
