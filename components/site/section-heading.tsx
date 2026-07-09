import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

interface SectionHeadingProps {
  /** Editorial index shown in the kicker, e.g. "01" */
  index?: string;
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

/** Numbered editorial section heading used across the public site. */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "kicker",
          align === "center" && "justify-center",
          tone === "dark" ? "text-freight-soft" : "text-freight",
        )}
      >
        {index ? <span className="opacity-70">{index}</span> : null}
        {kicker}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          tone === "dark" ? "text-paper" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            tone === "dark" ? "text-paper/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
