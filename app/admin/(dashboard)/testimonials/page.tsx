import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialsTable } from "@/components/admin/testimonials/testimonials-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/lib/types";

export default async function AdminTestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Client voices shown on the homepage. The lowest sort order becomes the featured oversized quote."
        action={{ href: "/admin/testimonials/new", label: "New testimonial" }}
      />
      <TestimonialsTable testimonials={(data as TestimonialRow[]) ?? []} />
    </>
  );
}
