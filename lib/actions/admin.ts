"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { CACHE_TAGS } from "@/lib/queries";
import {
  jobSchema,
  postSchema,
  serviceSchema,
  settingsSchema,
  testimonialSchema,
  type JobInput,
  type PostInput,
  type ServiceInput,
  type SettingsInput,
  type TestimonialInput,
} from "@/lib/validations";
import type { InquiryStatus, WorkforceStatus } from "@/lib/types";

export type AdminResult = { success: true; id?: string } | { success: false; error: string };

function fail(error: unknown, fallback: string): AdminResult {
  const message =
    error instanceof Error && error.message === "Unauthorised"
      ? "Your session has expired — please sign in again."
      : fallback;
  console.error(fallback, error);
  return { success: false, error: message };
}

/* ---------------------------------------------------------- services --- */

export async function upsertService(input: ServiceInput): Promise<AdminResult> {
  try {
    const parsed = serviceSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
    }
    const { supabase } = await requireAdmin();
    const { id, ...values } = parsed.data;
    const row = {
      ...values,
      icon: values.icon || null,
      meta_title: values.meta_title || null,
      meta_description: values.meta_description || null,
    };

    const query = id
      ? supabase.from("services").update(row).eq("id", id).select("id").single()
      : supabase.from("services").insert(row).select("id").single();
    const { data, error } = await query;
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A service with this slug already exists in that division." };
      }
      throw error;
    }

    revalidateTag(CACHE_TAGS.services, "max");
    revalidatePath("/");
    revalidatePath(`/services/${row.division}`);
    return { success: true, id: data.id };
  } catch (error) {
    return fail(error, "Could not save the service.");
  }
}

export async function deleteService(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    revalidateTag(CACHE_TAGS.services, "max");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the service.");
  }
}

/* -------------------------------------------------------------- jobs --- */

export async function upsertJob(input: JobInput): Promise<AdminResult> {
  try {
    const parsed = jobSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
    }
    const { supabase } = await requireAdmin();
    const { id, ...values } = parsed.data;
    const row = {
      ...values,
      salary_text: values.salary_text || null,
      application_email: values.application_email || null,
      application_instructions: values.application_instructions || null,
      closes_at: values.closes_at || null,
    };

    const query = id
      ? supabase.from("jobs").update(row).eq("id", id).select("id").single()
      : supabase.from("jobs").insert(row).select("id").single();
    const { data, error } = await query;
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A job with this slug or reference already exists." };
      }
      throw error;
    }

    revalidateTag(CACHE_TAGS.jobs, "max");
    revalidatePath("/jobs");
    revalidatePath("/");
    return { success: true, id: data.id };
  } catch (error) {
    return fail(error, "Could not save the job listing.");
  }
}

export async function deleteJob(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) throw error;
    revalidateTag(CACHE_TAGS.jobs, "max");
    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the job listing.");
  }
}

/* ------------------------------------------------------------- posts --- */

export async function upsertPost(input: PostInput): Promise<AdminResult> {
  try {
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
    }
    const { supabase } = await requireAdmin();
    const { id, ...values } = parsed.data;

    // Stamp published_at the first time a post goes live.
    let publishedAt: string | undefined;
    if (values.is_published) {
      if (id) {
        const { data: existing } = await supabase
          .from("posts")
          .select("published_at")
          .eq("id", id)
          .maybeSingle();
        publishedAt = existing?.published_at ?? new Date().toISOString();
      } else {
        publishedAt = new Date().toISOString();
      }
    }

    const row = {
      ...values,
      cover_image_url: values.cover_image_url || null,
      meta_title: values.meta_title || null,
      meta_description: values.meta_description || null,
      ...(publishedAt !== undefined ? { published_at: publishedAt } : {}),
    };

    const query = id
      ? supabase.from("posts").update(row).eq("id", id).select("id").single()
      : supabase.from("posts").insert(row).select("id").single();
    const { data, error } = await query;
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A post with this slug already exists." };
      }
      throw error;
    }

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidatePath("/blog");
    return { success: true, id: data.id };
  } catch (error) {
    return fail(error, "Could not save the post.");
  }
}

export async function deletePost(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    revalidateTag(CACHE_TAGS.posts, "max");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the post.");
  }
}

/* ------------------------------------------------------ testimonials --- */

export async function upsertTestimonial(input: TestimonialInput): Promise<AdminResult> {
  try {
    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
    }
    const { supabase } = await requireAdmin();
    const { id, ...row } = parsed.data;
    const query = id
      ? supabase.from("testimonials").update(row).eq("id", id).select("id").single()
      : supabase.from("testimonials").insert(row).select("id").single();
    const { data, error } = await query;
    if (error) throw error;
    revalidateTag(CACHE_TAGS.testimonials, "max");
    revalidatePath("/");
    return { success: true, id: data.id };
  } catch (error) {
    return fail(error, "Could not save the testimonial.");
  }
}

export async function deleteTestimonial(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    revalidateTag(CACHE_TAGS.testimonials, "max");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the testimonial.");
  }
}

/* ------------------------------------------------------------- leads --- */

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not update the inquiry.");
  }
}

export async function updateWorkforceStatus(
  id: string,
  status: WorkforceStatus,
): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("workforce_requests").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/workforce");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not update the request.");
  }
}

export async function deleteInquiry(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the inquiry.");
  }
}

export async function deleteWorkforceRequest(id: string): Promise<AdminResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("workforce_requests").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/workforce");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not delete the request.");
  }
}

/* ---------------------------------------------------------- settings --- */

export async function updateSettings(input: SettingsInput): Promise<AdminResult> {
  try {
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
    }
    const { supabase } = await requireAdmin();

    const nullable = (v: string | undefined) => v || null;
    const row = {
      id: 1,
      site_name: parsed.data.site_name,
      country: parsed.data.country,
      opening_hours: parsed.data.opening_hours,
      tagline: nullable(parsed.data.tagline),
      meta_title: nullable(parsed.data.meta_title),
      meta_description: nullable(parsed.data.meta_description),
      logo_url: nullable(parsed.data.logo_url),
      logo_dark_url: nullable(parsed.data.logo_dark_url),
      favicon_url: nullable(parsed.data.favicon_url),
      og_image_url: nullable(parsed.data.og_image_url),
      phone: nullable(parsed.data.phone),
      email: nullable(parsed.data.email),
      address_line1: nullable(parsed.data.address_line1),
      address_line2: nullable(parsed.data.address_line2),
      city: nullable(parsed.data.city),
      postcode: nullable(parsed.data.postcode),
      contact_email: nullable(parsed.data.contact_email),
      workforce_email: nullable(parsed.data.workforce_email),
      applications_email: nullable(parsed.data.applications_email),
      linkedin_url: nullable(parsed.data.linkedin_url),
      facebook_url: nullable(parsed.data.facebook_url),
      companies_house_number: nullable(parsed.data.companies_house_number),
    };

    const { error } = await supabase.from("site_settings").upsert(row);
    if (error) throw error;

    // Settings feed the layout, footer, contact page and every job's
    // application panel — refresh everything that reads them.
    revalidateTag(CACHE_TAGS.settings, "max");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return fail(error, "Could not save the settings.");
  }
}
