"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { antiBotSchema, contactSchema, workforceSchema } from "@/lib/validations";
import type { AntiBotInput, ContactInput, WorkforceInput } from "@/lib/validations";

export type ActionResult = { success: true } | { success: false; error: string };

const NOT_CONFIGURED =
  "The site is not connected to its database yet. Please email us directly instead.";

/** Minimum believable time for a human to fill and submit a form. */
const MIN_FILL_MS = 3_000;
/** Reject absurdly stale form tokens (page left open for days / replayed). */
const MAX_FILL_MS = 12 * 60 * 60 * 1_000;

/**
 * Heuristic bot screen: the hidden honeypot must stay empty and the
 * submission must arrive within a human-plausible window of the form
 * being rendered. Failures are treated as bots.
 */
function isLikelyBot(bot: AntiBotInput): boolean {
  const parsed = antiBotSchema.safeParse(bot);
  if (!parsed.success) return true;
  if (parsed.data.website.trim() !== "") return true;
  const elapsed = Date.now() - parsed.data.form_started_at;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}

/** Persists a validated contact inquiry to the lead-tracking table. */
export async function submitContactInquiry(
  input: ContactInput,
  bot: AntiBotInput,
): Promise<ActionResult> {
  // Silently "accept" bot submissions without persisting anything, so
  // automated senders can't detect (and adapt to) the screen.
  if (isLikelyBot(bot)) return { success: true };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  const supabase = createPublicClient();
  if (!supabase) return { success: false, error: NOT_CONFIGURED };

  const { error } = await supabase.from("contact_inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    console.error("contact_inquiries insert failed:", error.message);
    return { success: false, error: "Something went wrong saving your message. Please try again." };
  }
  return { success: true };
}

/** Persists a validated multi-step workforce request (logistics B2B pipeline). */
export async function submitWorkforceRequest(
  input: WorkforceInput,
  bot: AntiBotInput,
): Promise<ActionResult> {
  if (isLikelyBot(bot)) return { success: true };

  const parsed = workforceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  const supabase = createPublicClient();
  if (!supabase) return { success: false, error: NOT_CONFIGURED };

  const { error } = await supabase.from("workforce_requests").insert({
    company_name: parsed.data.company_name,
    contact_name: parsed.data.contact_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    sector: parsed.data.sector,
    site_location: parsed.data.site_location,
    headcount: parsed.data.headcount,
    roles_needed: parsed.data.roles_needed,
    skills: parsed.data.skills || null,
    shift_pattern: parsed.data.shift_pattern,
    start_date: parsed.data.start_date || null,
    duration: parsed.data.duration,
    urgency: parsed.data.urgency,
    notes: parsed.data.notes || null,
  });

  if (error) {
    console.error("workforce_requests insert failed:", error.message);
    return { success: false, error: "Something went wrong saving your request. Please try again." };
  }
  return { success: true };
}
