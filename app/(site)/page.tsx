import type { Metadata } from "next";
import { HomeHero } from "@/components/site/home/hero";
import { DivisionSplit } from "@/components/site/home/division-split";
import { StatsBand } from "@/components/site/home/stats-band";
import { Testimonials } from "@/components/site/home/testimonials";
import { LatestSection } from "@/components/site/home/latest";
import { CtaBand } from "@/components/site/cta-band";
import { getJobs, getPosts, getServices, getSettings, getTestimonials } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const meta = buildMetadata({
    settings,
    title: settings.meta_title ?? settings.site_name,
    description:
      settings.meta_description ??
      "Vetted drivers, warehouse teams and healthcare professionals for organisations across the UK.",
    path: "/",
  });
  // The homepage title is already the full brand line — skip the
  // "%s | site name" template every other page uses.
  return { ...meta, title: { absolute: (meta.title as string) ?? settings.site_name } };
}

export default async function HomePage() {
  const [logistics, healthcare, jobs, posts, testimonials] = await Promise.all([
    getServices("logistics"),
    getServices("healthcare"),
    getJobs(),
    getPosts(),
    getTestimonials(),
  ]);

  return (
    <>
      <HomeHero />
      <DivisionSplit logistics={logistics} healthcare={healthcare} />
      <StatsBand />
      <Testimonials testimonials={testimonials} />
      <LatestSection jobs={jobs} posts={posts} />
      <CtaBand
        title="Need people this week, not this quarter?"
        description="Tell us your headcount, shift pattern and start date. Our team responds to every workforce request within one working hour."
        primary={{ href: "/workforce-request", label: "Request workforce" }}
        secondary={{ href: "/contact", label: "Talk to our team" }}
      />
    </>
  );
}
