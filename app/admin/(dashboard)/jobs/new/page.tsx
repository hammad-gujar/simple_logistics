import { AdminPageHeader } from "@/components/admin/page-header";
import { JobForm } from "@/components/admin/jobs/job-form";

export default function NewJobPage() {
  return (
    <>
      <AdminPageHeader
        title="New job listing"
        description="Give the role a unique reference — applicants quote it when they email their CV."
      />
      <JobForm />
    </>
  );
}
