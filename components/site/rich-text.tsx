import { cn } from "@/lib/utils";

/**
 * Renders trusted CMS-authored HTML (admin portal is the only author,
 * behind Supabase Auth) with the site's editorial typography.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
