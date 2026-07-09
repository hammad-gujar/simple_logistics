"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { AntiBotInput } from "@/lib/validations";

/**
 * Lightweight bot screen for public forms: a visually hidden honeypot
 * input (autofillers and naive bots complete it; humans never see it)
 * plus the timestamp the form mounted, checked server-side against a
 * minimum plausible fill time. Zero friction for real visitors.
 */
export function useAntiBot() {
  const startedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Stamped on mount (not render) — render must stay pure.
  useEffect(() => {
    if (startedAt.current === 0) startedAt.current = Date.now();
  }, []);

  const getAntiBotValues = (): AntiBotInput => ({
    website: honeypotRef.current?.value ?? "",
    form_started_at: startedAt.current,
  });

  return { honeypotRef, getAntiBotValues };
}

export function HoneypotField({
  inputRef,
  id,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  id: string;
}) {
  return (
    // Off-screen, not display:none — some bots skip invisible fields.
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        ref={inputRef}
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
