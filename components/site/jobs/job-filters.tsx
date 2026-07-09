"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "all";

interface JobFiltersProps {
  locations: string[];
  industries: string[];
  types: string[];
}

/**
 * URL-driven filters: every state lives in searchParams so filtered
 * views are shareable, crawlable and survive refresh.
 */
export function JobFilters({ locations, industries, types }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== ALL) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.replace(`/jobs${params.size ? `?${params}` : ""}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const onSearchChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("q", value.trim()), 350);
  };

  const hasFilters =
    Boolean(searchParams.get("q")) ||
    Boolean(searchParams.get("location")) ||
    Boolean(searchParams.get("type")) ||
    Boolean(searchParams.get("industry"));

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search role titles, keywords…"
          className="h-11 rounded-none bg-card pl-10"
          aria-label="Search vacancies"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
        <Select
          value={searchParams.get("location") ?? ALL}
          onValueChange={(v) => updateParam("location", v)}
        >
          <SelectTrigger className="h-11 rounded-none bg-card lg:w-44" aria-label="Filter by location">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("type") ?? ALL}
          onValueChange={(v) => updateParam("type", v)}
        >
          <SelectTrigger className="h-11 rounded-none bg-card lg:w-40" aria-label="Filter by job type">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("industry") ?? ALL}
          onValueChange={(v) => updateParam("industry", v)}
        >
          <SelectTrigger className="h-11 rounded-none bg-card lg:w-52" aria-label="Filter by industry">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All industries</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters ? (
          <Button
            variant="ghost"
            className="h-11 rounded-none text-muted-foreground"
            onClick={() => {
              setQuery("");
              startTransition(() => router.replace("/jobs", { scroll: false }));
            }}
          >
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
