import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_SETTINGS, mergeSettings } from "@/lib/settings";
import type {
  Division,
  JobRow,
  PostRow,
  ServiceRow,
  SiteSettings,
  TestimonialRow,
} from "@/lib/types";

/**
 * Public read layer. Every function is wrapped in unstable_cache with a
 * content tag, so public pages stay statically served until an admin
 * mutation calls revalidateTag() — the ISR contract for the whole site.
 */

export const CACHE_TAGS = {
  settings: "settings",
  services: "services",
  jobs: "jobs",
  posts: "posts",
  testimonials: "testimonials",
} as const;

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createPublicClient();
    if (!supabase) return DEFAULT_SETTINGS;
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    return mergeSettings(data);
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings], revalidate: 300 },
);

export const getServices = unstable_cache(
  async (division?: Division): Promise<ServiceRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];
    let query = supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (division) query = query.eq("division", division);
    const { data } = await query;
    return (data as ServiceRow[]) ?? [];
  },
  ["services"],
  { tags: [CACHE_TAGS.services], revalidate: 300 },
);

export const getServiceBySlug = unstable_cache(
  async (division: Division, slug: string): Promise<ServiceRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("division", division)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return (data as ServiceRow) ?? null;
  },
  ["service-by-slug"],
  { tags: [CACHE_TAGS.services], revalidate: 300 },
);

export const getJobs = unstable_cache(
  async (): Promise<JobRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    return (data as JobRow[]) ?? [];
  },
  ["jobs"],
  { tags: [CACHE_TAGS.jobs], revalidate: 300 },
);

export const getJobBySlug = unstable_cache(
  async (slug: string): Promise<JobRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return (data as JobRow) ?? null;
  },
  ["job-by-slug"],
  { tags: [CACHE_TAGS.jobs], revalidate: 300 },
);

export const getPosts = unstable_cache(
  async (): Promise<PostRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return (data as PostRow[]) ?? [];
  },
  ["posts"],
  { tags: [CACHE_TAGS.posts], revalidate: 300 },
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<PostRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return (data as PostRow) ?? null;
  },
  ["post-by-slug"],
  { tags: [CACHE_TAGS.posts], revalidate: 300 },
);

/**
 * Related-article scoring: shared tags weigh 2, shared category weighs 1,
 * recency breaks ties. Runs against the cached post list — no extra query.
 */
export async function getRelatedPosts(post: PostRow, limit = 3): Promise<PostRow[]> {
  const all = await getPosts();
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      const sharedCategory = p.category === post.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sharedCategory };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.post.published_at ?? b.post.created_at) -
          Date.parse(a.post.published_at ?? a.post.created_at),
    )
    .slice(0, limit)
    .map((s) => s.post);
}

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data as TestimonialRow[]) ?? [];
  },
  ["testimonials"],
  { tags: [CACHE_TAGS.testimonials], revalidate: 300 },
);
