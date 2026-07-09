import { z } from "zod";

/** Shared, end-to-end validation schemas (client forms + server actions). */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Use at least 10 characters")
      .max(72)
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

/**
 * Anti-bot metadata sent alongside public form submissions:
 * `website` is a honeypot (hidden field humans never fill) and
 * `form_started_at` is the client timestamp when the form mounted,
 * used server-side to reject inhumanly fast submissions.
 */
export const antiBotSchema = z.object({
  website: z.string().max(200),
  form_started_at: z.number().int().nonnegative(),
});
export type AntiBotInput = z.infer<typeof antiBotSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .max(30)
    .regex(/^[+\d\s()-]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(3, "Please add a short subject").max(160),
  message: z.string().min(20, "Tell us a little more (at least 20 characters)").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ---------------------------------- Workforce request (multi-step) --- */

export const workforceStepCompany = z.object({
  company_name: z.string().min(2, "Company name is required").max(160),
  contact_name: z.string().min(2, "Contact name is required").max(120),
  email: z.string().email("Enter a valid work email"),
  phone: z
    .string()
    .min(7, "Enter a contact number")
    .max(30)
    .regex(/^[+\d\s()-]+$/, "Enter a valid phone number"),
  sector: z.string().min(2, "Select or describe your sector").max(120),
  site_location: z.string().min(2, "Where is the workforce needed?").max(160),
});

export const workforceStepRequirements = z.object({
  headcount: z
    .number("Enter how many workers you need")
    .int("Whole numbers only")
    .min(1, "At least one worker")
    .max(5000, "For requests above 5,000 heads, call us directly"),
  roles_needed: z.array(z.string().min(1)).min(1, "Select at least one role"),
  skills: z.string().max(2000).optional().or(z.literal("")),
  shift_pattern: z.string().min(2, "Select a shift pattern").max(120),
});

export const workforceStepSchedule = z.object({
  start_date: z.string().optional().or(z.literal("")),
  duration: z.string().min(2, "Select an expected duration").max(120),
  urgency: z.enum(["standard", "priority", "critical"]),
  notes: z.string().max(4000).optional().or(z.literal("")),
});

export const workforceSchema = z.object({
  ...workforceStepCompany.shape,
  ...workforceStepRequirements.shape,
  ...workforceStepSchedule.shape,
});
export type WorkforceInput = z.infer<typeof workforceSchema>;

/* ------------------------------------------------------- Admin CMS --- */

const slugField = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

export const benefitSchema = z.object({
  title: z.string().min(2, "Benefit title required").max(160),
  description: z.string().min(2, "Benefit description required").max(600),
});

export const faqSchema = z.object({
  question: z.string().min(4, "Question required").max(300),
  answer: z.string().min(4, "Answer required").max(2000),
});

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  division: z.enum(["logistics", "healthcare"]),
  slug: slugField,
  title: z.string().min(3).max(160),
  excerpt: z.string().min(10, "Write a short summary (used on listing cards)").max(400),
  body_html: z.string().min(1, "Service description is required"),
  benefits: z.array(benefitSchema).max(12),
  faqs: z.array(faqSchema).max(12),
  icon: z.string().max(60).optional().or(z.literal("")),
  meta_title: z.string().max(70).optional().or(z.literal("")),
  meta_description: z.string().max(170).optional().or(z.literal("")),
  is_published: z.boolean(),
  sort_order: z.number("Enter a sort position").int().min(0).max(999),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const jobSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugField,
  reference: z.string().min(2, "Job reference required (quoted by applicants)").max(30),
  title: z.string().min(3).max(160),
  division: z.enum(["logistics", "healthcare"]),
  location: z.string().min(2).max(160),
  job_type: z.enum(["Full-time", "Part-time", "Temporary", "Contract"]),
  industry: z.string().min(2).max(120),
  salary_text: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().min(10).max(400),
  body_html: z.string().min(1, "Job description is required"),
  application_email: z.string().email().optional().or(z.literal("")),
  application_instructions: z.string().max(2000).optional().or(z.literal("")),
  is_published: z.boolean(),
  closes_at: z.string().optional().or(z.literal("")),
});
export type JobInput = z.infer<typeof jobSchema>;

export const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugField,
  title: z.string().min(3).max(180),
  excerpt: z.string().min(10).max(400),
  body_html: z.string().min(1, "Post content is required"),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().min(2).max(80),
  tags: z.array(z.string().min(1).max(50)).max(12),
  meta_title: z.string().max(70).optional().or(z.literal("")),
  meta_description: z.string().max(170).optional().or(z.literal("")),
  is_published: z.boolean(),
});
export type PostInput = z.infer<typeof postSchema>;

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  quote: z.string().min(10).max(800),
  author_name: z.string().min(2).max(120),
  author_role: z.string().min(2).max(160),
  division: z.enum(["logistics", "healthcare"]).nullable(),
  sort_order: z.number("Enter a sort position").int().min(0).max(999),
  is_published: z.boolean(),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const openingHoursSchema = z.object({
  days: z.string().min(2).max(60),
  hours: z.string().min(2).max(60),
});

const optionalUrl = z.string().url("Enter a full URL including https://").optional().or(z.literal(""));
const optionalEmail = z.string().email().optional().or(z.literal(""));

export const settingsSchema = z.object({
  site_name: z.string().min(2).max(120),
  tagline: z.string().max(200).optional().or(z.literal("")),
  meta_title: z.string().max(70).optional().or(z.literal("")),
  meta_description: z.string().max(170).optional().or(z.literal("")),
  logo_url: optionalUrl,
  logo_dark_url: optionalUrl,
  favicon_url: optionalUrl,
  og_image_url: optionalUrl,
  phone: z.string().max(30).optional().or(z.literal("")),
  email: optionalEmail,
  address_line1: z.string().max(160).optional().or(z.literal("")),
  address_line2: z.string().max(160).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postcode: z.string().max(12).optional().or(z.literal("")),
  country: z.string().min(2).max(80),
  opening_hours: z.array(openingHoursSchema).max(7),
  contact_email: optionalEmail,
  workforce_email: optionalEmail,
  applications_email: optionalEmail,
  linkedin_url: optionalUrl,
  facebook_url: optionalUrl,
  companies_house_number: z.string().max(20).optional().or(z.literal("")),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
