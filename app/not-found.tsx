import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-ink-deeper px-4 text-center">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <p className="kicker relative justify-center text-freight-soft">Error 404</p>
      <h1 className="relative mt-6 font-display text-5xl font-semibold text-paper sm:text-6xl">
        This route doesn&rsquo;t exist.
      </h1>
      <p className="relative mt-5 max-w-md text-paper/65">
        The page you&rsquo;re looking for may have been moved or unpublished. Let&rsquo;s
        get you back on track.
      </p>
      <Button
        asChild
        size="lg"
        className="relative mt-9 gap-2 rounded-none bg-freight px-7 text-ink-deeper hover:bg-freight-soft"
      >
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to the homepage
        </Link>
      </Button>
    </div>
  );
}
