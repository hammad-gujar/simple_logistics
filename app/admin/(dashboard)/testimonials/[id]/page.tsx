import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const testimonial = data as TestimonialRow;

  return (
    <>
      <AdminPageHeader title={`Edit testimonial — ${testimonial.author_name}`} />
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
