/**
 * Domain types mirroring the Supabase schema (see supabase/migrations).
 * These are the single source of truth for data shapes across RSC pages,
 * server actions and admin forms.
 */

export type Division = "logistics" | "healthcare";

export const DIVISIONS: readonly Division[] = ["logistics", "healthcare"] as const;

export interface Benefit {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface ServiceRow {
  id: string;
  division: Division;
  slug: string;
  title: string;
  excerpt: string;
  body_html: string;
  benefits: Benefit[];
  faqs: Faq[];
  icon: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type JobType = "Full-time" | "Part-time" | "Temporary" | "Contract";

export const JOB_TYPES: readonly JobType[] = [
  "Full-time",
  "Part-time",
  "Temporary",
  "Contract",
] as const;

export interface JobRow {
  id: string;
  slug: string;
  reference: string;
  title: string;
  division: Division;
  location: string;
  job_type: JobType;
  industry: string;
  salary_text: string | null;
  summary: string;
  body_html: string;
  application_email: string | null;
  application_instructions: string | null;
  is_published: boolean;
  closes_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_html: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  division: Division | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export type InquiryStatus = "new" | "in_review" | "closed";

export interface ContactInquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export type WorkforceUrgency = "standard" | "priority" | "critical";
export type WorkforceStatus = "new" | "contacted" | "fulfilled" | "closed";

export interface WorkforceRequestRow {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sector: string;
  site_location: string;
  headcount: number;
  roles_needed: string[];
  skills: string | null;
  shift_pattern: string;
  start_date: string | null;
  duration: string;
  urgency: WorkforceUrgency;
  notes: string | null;
  status: WorkforceStatus;
  created_at: string;
}

export interface SiteSettingsRow {
  id: number;
  site_name: string;
  tagline: string | null;
  meta_title: string | null;
  meta_description: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  country: string;
  opening_hours: OpeningHours[];
  contact_email: string | null;
  workforce_email: string | null;
  applications_email: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  companies_house_number: string | null;
  updated_at: string;
}

/** Settings with all display-critical fields guaranteed present. */
export type SiteSettings = SiteSettingsRow;
