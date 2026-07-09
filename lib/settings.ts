import type { SiteSettings } from "@/lib/types";

/**
 * Fallback business profile used before the CMS settings row is loaded
 * (fresh installs, missing env, or during local builds). Every public
 * surface reads the merged result of these defaults + the Supabase row —
 * nothing business-critical is hardcoded in components.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Simple Logistics Limited",
  tagline: "Workforce solutions for UK logistics and healthcare",
  meta_title: "Simple Logistics Limited — Logistics Workforce & Healthcare Staffing, UK",
  meta_description:
    "Simple Logistics Limited supplies vetted drivers, warehouse operatives and healthcare professionals to organisations across the United Kingdom.",
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  og_image_url: null,
  phone: "+44 (0)121 000 0000",
  email: "info@simplelogistics.co.uk",
  address_line1: "Century House",
  address_line2: "12 Trafford Way",
  city: "Birmingham",
  postcode: "B1 1AA",
  country: "United Kingdom",
  opening_hours: [
    { days: "Monday – Friday", hours: "07:00 – 19:00" },
    { days: "Saturday", hours: "08:00 – 14:00" },
    { days: "Sunday & Bank Holidays", hours: "On-call service" },
  ],
  contact_email: "info@simplelogistics.co.uk",
  workforce_email: "workforce@simplelogistics.co.uk",
  applications_email: "careers@simplelogistics.co.uk",
  linkedin_url: null,
  facebook_url: null,
  companies_house_number: null,
  updated_at: new Date(0).toISOString(),
};

export function mergeSettings(row: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!row) return DEFAULT_SETTINGS;
  const merged = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && value !== undefined && value !== "") {
      merged[key] = value;
    }
  }
  return merged as unknown as SiteSettings;
}
