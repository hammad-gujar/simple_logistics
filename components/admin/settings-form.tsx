"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/lib/actions/admin";
import { settingsSchema, type SettingsInput } from "@/lib/validations";
import type { SiteSettings } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: settings.site_name,
      tagline: settings.tagline ?? "",
      meta_title: settings.meta_title ?? "",
      meta_description: settings.meta_description ?? "",
      logo_url: settings.logo_url ?? "",
      logo_dark_url: settings.logo_dark_url ?? "",
      favicon_url: settings.favicon_url ?? "",
      og_image_url: settings.og_image_url ?? "",
      phone: settings.phone ?? "",
      email: settings.email ?? "",
      address_line1: settings.address_line1 ?? "",
      address_line2: settings.address_line2 ?? "",
      city: settings.city ?? "",
      postcode: settings.postcode ?? "",
      country: settings.country,
      opening_hours: settings.opening_hours,
      contact_email: settings.contact_email ?? "",
      workforce_email: settings.workforce_email ?? "",
      applications_email: settings.applications_email ?? "",
      linkedin_url: settings.linkedin_url ?? "",
      facebook_url: settings.facebook_url ?? "",
      companies_house_number: settings.companies_house_number ?? "",
    },
  });

  const hours = useFieldArray({ control, name: "opening_hours" });

  const onSubmit = async (values: SettingsInput) => {
    const result = await updateSettings(values);
    if (result.success) {
      toast.success("Settings saved — the public site refreshes immediately.");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <Section
          title="Identity & metadata"
          description="Default titles and descriptions used wherever a page doesn't define its own."
        >
          <div>
            <Label htmlFor="set-name">Site name</Label>
            <Input id="set-name" className="mt-2 rounded-none" {...register("site_name")} />
            <FieldError message={errors.site_name?.message} />
          </div>
          <div>
            <Label htmlFor="set-tagline">Tagline</Label>
            <Input id="set-tagline" className="mt-2 rounded-none" {...register("tagline")} />
            <FieldError message={errors.tagline?.message} />
          </div>
          <div>
            <Label htmlFor="set-meta-title">Default meta title</Label>
            <Input id="set-meta-title" className="mt-2 rounded-none" {...register("meta_title")} />
            <FieldError message={errors.meta_title?.message} />
          </div>
          <div>
            <Label htmlFor="set-meta-desc">Default meta description</Label>
            <Textarea
              id="set-meta-desc"
              rows={3}
              className="mt-2 rounded-none"
              {...register("meta_description")}
            />
            <FieldError message={errors.meta_description?.message} />
          </div>
        </Section>

        <Section
          title="Brand assets"
          description="Absolute URLs (e.g. Supabase Storage public URLs). Leave blank to use the built-in wordmark."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="set-logo">Logo URL</Label>
              <Input id="set-logo" className="mt-2 rounded-none" {...register("logo_url")} />
              <FieldError message={errors.logo_url?.message} />
            </div>
            <div>
              <Label htmlFor="set-logo-dark">Dark logo URL</Label>
              <Input id="set-logo-dark" className="mt-2 rounded-none" {...register("logo_dark_url")} />
              <FieldError message={errors.logo_dark_url?.message} />
            </div>
            <div>
              <Label htmlFor="set-favicon">Favicon URL</Label>
              <Input id="set-favicon" className="mt-2 rounded-none" {...register("favicon_url")} />
              <FieldError message={errors.favicon_url?.message} />
            </div>
            <div>
              <Label htmlFor="set-og">Default OG image URL</Label>
              <Input id="set-og" className="mt-2 rounded-none" {...register("og_image_url")} />
              <FieldError message={errors.og_image_url?.message} />
            </div>
          </div>
        </Section>

        <Section
          title="Workflow routing"
          description="Where each lead type is directed. Job listings can override the applications email per role."
        >
          <div>
            <Label htmlFor="set-contact-email">Contact form notifications</Label>
            <Input
              id="set-contact-email"
              type="email"
              className="mt-2 rounded-none"
              {...register("contact_email")}
            />
            <FieldError message={errors.contact_email?.message} />
          </div>
          <div>
            <Label htmlFor="set-workforce-email">Workforce request notifications</Label>
            <Input
              id="set-workforce-email"
              type="email"
              className="mt-2 rounded-none"
              {...register("workforce_email")}
            />
            <FieldError message={errors.workforce_email?.message} />
          </div>
          <div>
            <Label htmlFor="set-applications-email">Job applications (default)</Label>
            <Input
              id="set-applications-email"
              type="email"
              className="mt-2 rounded-none"
              {...register("applications_email")}
            />
            <FieldError message={errors.applications_email?.message} />
          </div>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Business profile">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="set-phone">Main phone line</Label>
              <Input id="set-phone" className="mt-2 rounded-none" {...register("phone")} />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <Label htmlFor="set-email">Main email</Label>
              <Input id="set-email" type="email" className="mt-2 rounded-none" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="set-addr1">Address line 1</Label>
              <Input id="set-addr1" className="mt-2 rounded-none" {...register("address_line1")} />
              <FieldError message={errors.address_line1?.message} />
            </div>
            <div>
              <Label htmlFor="set-addr2">Address line 2</Label>
              <Input id="set-addr2" className="mt-2 rounded-none" {...register("address_line2")} />
              <FieldError message={errors.address_line2?.message} />
            </div>
            <div>
              <Label htmlFor="set-city">City</Label>
              <Input id="set-city" className="mt-2 rounded-none" {...register("city")} />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <Label htmlFor="set-postcode">Postcode</Label>
              <Input id="set-postcode" className="mt-2 rounded-none" {...register("postcode")} />
              <FieldError message={errors.postcode?.message} />
            </div>
            <div>
              <Label htmlFor="set-country">Country</Label>
              <Input id="set-country" className="mt-2 rounded-none" {...register("country")} />
              <FieldError message={errors.country?.message} />
            </div>
            <div>
              <Label htmlFor="set-ch">Companies House no.</Label>
              <Input id="set-ch" className="mt-2 rounded-none font-mono" {...register("companies_house_number")} />
              <FieldError message={errors.companies_house_number?.message} />
            </div>
          </div>
        </Section>

        <Section
          title="Operating hours"
          description="Shown in the footer, contact page and structured data."
        >
          {hours.fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3">
              <div className="flex-1">
                <Label htmlFor={`hours-days-${index}`}>Days</Label>
                <Input
                  id={`hours-days-${index}`}
                  className="mt-2 rounded-none"
                  {...register(`opening_hours.${index}.days`)}
                />
                <FieldError message={errors.opening_hours?.[index]?.days?.message} />
              </div>
              <div className="flex-1">
                <Label htmlFor={`hours-hours-${index}`}>Hours</Label>
                <Input
                  id={`hours-hours-${index}`}
                  className="mt-2 rounded-none"
                  {...register(`opening_hours.${index}.hours`)}
                />
                <FieldError message={errors.opening_hours?.[index]?.hours?.message} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-destructive"
                onClick={() => hours.remove(index)}
                aria-label="Remove opening hours row"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-none"
            onClick={() => hours.append({ days: "", hours: "" })}
          >
            <Plus className="size-3.5" /> Add row
          </Button>
        </Section>

        <Section title="Social profiles">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="set-linkedin">LinkedIn URL</Label>
              <Input id="set-linkedin" className="mt-2 rounded-none" {...register("linkedin_url")} />
              <FieldError message={errors.linkedin_url?.message} />
            </div>
            <div>
              <Label htmlFor="set-facebook">Facebook URL</Label>
              <Input id="set-facebook" className="mt-2 rounded-none" {...register("facebook_url")} />
              <FieldError message={errors.facebook_url?.message} />
            </div>
          </div>
        </Section>

        <Button type="submit" size="lg" className="w-full gap-2 rounded-none" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {isSubmitting ? "Saving…" : "Save global settings"}
        </Button>
      </div>
    </form>
  );
}
