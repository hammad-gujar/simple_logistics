import type { MetadataRoute } from "next";
import { getJobs, getPosts, getServices } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, jobs, posts] = await Promise.all([getServices(), getJobs(), getPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services/logistics"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/services/healthcare"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/jobs"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/workforce-request"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.division}/${s.slug}`),
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...jobs.map((j) => ({
      url: absoluteUrl(`/jobs/${j.slug}`),
      lastModified: new Date(j.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
