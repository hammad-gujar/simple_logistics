import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/jobs/job-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobRow } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const job = data as JobRow;

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${job.title}`}
        description={`Reference ${job.reference} — changes go live as soon as you save.`}
      />
      <JobForm job={job} />
    </>
  );
}
