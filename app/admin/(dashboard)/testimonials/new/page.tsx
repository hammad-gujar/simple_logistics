import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <>
      <AdminPageHeader title="New testimonial" />
      <TestimonialForm />
    </>
  );
}
