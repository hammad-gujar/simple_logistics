"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoneypotField, useAntiBot } from "@/components/site/anti-bot";
import { submitWorkforceRequest } from "@/lib/actions/public";
import { workforceSchema, type WorkforceInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

const SECTORS = [
  "3PL / Fulfilment",
  "Retail Distribution",
  "Parcel & Courier Networks",
  "Manufacturing",
  "Food & Drink",
  "Construction Logistics",
  "Healthcare / Care Provider",
  "Other",
];

const ROLE_OPTIONS = [
  "HGV Class 1 Driver",
  "HGV Class 2 Driver",
  "7.5t / Multi-drop Driver",
  "Van Driver / Courier",
  "Warehouse Operative",
  "FLT — Counterbalance",
  "FLT — Reach",
  "Shift Supervisor / Team Leader",
  "Care Assistant",
  "Support Worker",
  "Registered Nurse (RGN / RMN)",
];

const SHIFT_PATTERNS = [
  "Days (Mon–Fri)",
  "Nights",
  "Rotating earlies / lates",
  "4-on / 4-off",
  "Weekends",
  "Mixed / multiple patterns",
];

const DURATIONS = [
  "Ongoing requirement",
  "1–4 weeks",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Seasonal peak cover",
];

const URGENCY_OPTIONS = [
  {
    value: "standard",
    title: "Standard",
    description: "Deployment within 1–2 weeks",
  },
  {
    value: "priority",
    title: "Priority",
    description: "Needed within 2–5 working days",
  },
  {
    value: "critical",
    title: "Critical",
    description: "24–48 hour emergency cover",
  },
] as const;

const STEPS = [
  { title: "Company profile", icon: Building2 },
  { title: "Workforce requirements", icon: Users },
  { title: "Schedule & urgency", icon: CalendarClock },
] as const;

const STEP_FIELDS: FieldPath<WorkforceInput>[][] = [
  ["company_name", "contact_name", "email", "phone", "sector", "site_location"],
  ["headcount", "roles_needed", "skills", "shift_pattern"],
  ["start_date", "duration", "urgency", "notes"],
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function WorkforceRequestForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { honeypotRef, getAntiBotValues } = useAntiBot();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkforceInput>({
    resolver: zodResolver(workforceSchema),
    mode: "onTouched",
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      sector: "",
      site_location: "",
      headcount: 1,
      roles_needed: [],
      skills: "",
      shift_pattern: "",
      start_date: "",
      duration: "",
      urgency: "standard",
      notes: "",
    },
  });

  const selectedRoles = watch("roles_needed");
  const sector = watch("sector");
  const shiftPattern = watch("shift_pattern");
  const duration = watch("duration");
  const urgency = watch("urgency");

  const toggleRole = (role: string) => {
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setValue("roles_needed", next, { shouldValidate: true });
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (values: WorkforceInput) => {
    const result = await submitWorkforceRequest(values, getAntiBotValues());
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center border border-border bg-card p-12 text-center sm:p-16">
        <CheckCircle2 className="size-12 text-care" aria-hidden />
        <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">
          Request logged.
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          Your workforce request is with our logistics desk. A consultant will call you
          within one working hour (during opening hours) with availability and rates.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card">
      {/* Step rail */}
      <ol className="grid grid-cols-3 border-b border-border" aria-label="Form progress">
        {STEPS.map((s, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          return (
            <li
              key={s.title}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "relative flex items-center gap-3 border-r border-border px-4 py-4 last:border-r-0 sm:px-6",
                state === "todo" && "opacity-45",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center border font-mono text-xs",
                  state === "done"
                    ? "border-care bg-care text-white"
                    : state === "current"
                      ? "border-freight bg-freight text-ink-deeper"
                      : "border-border bg-background text-muted-foreground",
                )}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {s.title}
              </span>
              {state === "current" ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-freight" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative p-7 sm:p-10">
        <HoneypotField inputRef={honeypotRef} id="workforce-website" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {step === 0 ? (
              <fieldset className="space-y-5">
                <legend className="sr-only">Company profile</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wf-company">Company name</Label>
                    <Input
                      id="wf-company"
                      className="mt-2 rounded-none"
                      autoComplete="organization"
                      {...register("company_name")}
                    />
                    <FieldError message={errors.company_name?.message} />
                  </div>
                  <div>
                    <Label htmlFor="wf-contact">Your name</Label>
                    <Input
                      id="wf-contact"
                      className="mt-2 rounded-none"
                      autoComplete="name"
                      {...register("contact_name")}
                    />
                    <FieldError message={errors.contact_name?.message} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wf-email">Work email</Label>
                    <Input
                      id="wf-email"
                      type="email"
                      className="mt-2 rounded-none"
                      autoComplete="email"
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="wf-phone">Phone</Label>
                    <Input
                      id="wf-phone"
                      type="tel"
                      className="mt-2 rounded-none"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wf-sector">Sector</Label>
                    <Select
                      value={sector || undefined}
                      onValueChange={(v) =>
                        setValue("sector", v ?? "", { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="wf-sector" className="mt-2 w-full rounded-none">
                        <SelectValue placeholder="Select your sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.sector?.message} />
                  </div>
                  <div>
                    <Label htmlFor="wf-location">Site location (town / postcode)</Label>
                    <Input
                      id="wf-location"
                      className="mt-2 rounded-none"
                      {...register("site_location")}
                    />
                    <FieldError message={errors.site_location?.message} />
                  </div>
                </div>
              </fieldset>
            ) : null}

            {step === 1 ? (
              <fieldset className="space-y-6">
                <legend className="sr-only">Workforce requirements</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wf-headcount">Headcount required</Label>
                    <Input
                      id="wf-headcount"
                      type="number"
                      min={1}
                      className="mt-2 rounded-none"
                      {...register("headcount", { valueAsNumber: true })}
                    />
                    <FieldError message={errors.headcount?.message} />
                  </div>
                  <div>
                    <Label htmlFor="wf-shift">Shift pattern</Label>
                    <Select
                      value={shiftPattern || undefined}
                      onValueChange={(v) =>
                        setValue("shift_pattern", v ?? "", { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="wf-shift" className="mt-2 w-full rounded-none">
                        <SelectValue placeholder="Select shift pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIFT_PATTERNS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.shift_pattern?.message} />
                  </div>
                </div>

                <div>
                  <Label>Roles needed</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((role) => {
                      const active = selectedRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          aria-pressed={active}
                          className={cn(
                            "border px-3.5 py-2 text-sm font-medium transition-all",
                            active
                              ? "border-freight bg-freight/10 text-foreground shadow-[inset_0_0_0_1px_var(--freight)]"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                          )}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError message={errors.roles_needed?.message} />
                </div>

                <div>
                  <Label htmlFor="wf-skills">
                    Specialised skills or licences{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="wf-skills"
                    rows={3}
                    placeholder="e.g. ADR certification, hiab experience, dementia care training…"
                    className="mt-2 rounded-none"
                    {...register("skills")}
                  />
                  <FieldError message={errors.skills?.message} />
                </div>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset className="space-y-6">
                <legend className="sr-only">Schedule and urgency</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="wf-start">
                      Ideal start date <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="wf-start"
                      type="date"
                      className="mt-2 rounded-none"
                      {...register("start_date")}
                    />
                    <FieldError message={errors.start_date?.message} />
                  </div>
                  <div>
                    <Label htmlFor="wf-duration">Expected duration</Label>
                    <Select
                      value={duration || undefined}
                      onValueChange={(v) =>
                        setValue("duration", v ?? "", { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="wf-duration" className="mt-2 w-full rounded-none">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.duration?.message} />
                  </div>
                </div>

                <div>
                  <Label>Fulfilment urgency</Label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3" role="radiogroup">
                    {URGENCY_OPTIONS.map((option) => {
                      const active = urgency === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() =>
                            setValue("urgency", option.value, { shouldValidate: true })
                          }
                          className={cn(
                            "border p-4 text-left transition-all",
                            active
                              ? "border-freight bg-freight/10 shadow-[inset_0_0_0_1px_var(--freight)]"
                              : "border-border bg-background hover:border-foreground/30",
                          )}
                        >
                          <span className="block font-display font-semibold text-foreground">
                            {option.title}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {option.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <FieldError message={errors.urgency?.message} />
                </div>

                <div>
                  <Label htmlFor="wf-notes">
                    Anything else we should know?{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="wf-notes"
                    rows={4}
                    className="mt-2 rounded-none"
                    {...register("notes")}
                  />
                  <FieldError message={errors.notes?.message} />
                </div>
              </fieldset>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            className={cn("gap-2 rounded-none", step === 0 && "invisible")}
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" className="gap-2 rounded-none px-7" onClick={goNext}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="gap-2 rounded-none bg-freight px-7 text-ink-deeper hover:bg-freight-soft"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Submitting…" : "Submit workforce request"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
