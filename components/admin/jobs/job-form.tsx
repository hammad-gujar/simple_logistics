"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { upsertJob } from "@/lib/actions/admin";
import { jobSchema, type JobInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { JOB_TYPES, type JobRow } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function JobForm({ job }: { job?: JobRow }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: job
      ? {
          id: job.id,
          slug: job.slug,
          reference: job.reference,
          title: job.title,
          division: job.division,
          location: job.location,
          job_type: job.job_type,
          industry: job.industry,
          salary_text: job.salary_text ?? "",
          summary: job.summary,
          body_html: job.body_html,
          application_email: job.application_email ?? "",
          application_instructions: job.application_instructions ?? "",
          is_published: job.is_published,
          closes_at: job.closes_at ?? "",
        }
      : {
          slug: "",
          reference: "",
          title: "",
          division: "logistics",
          location: "",
          job_type: "Full-time",
          industry: "",
          salary_text: "",
          summary: "",
          body_html: "",
          application_email: "",
          application_instructions: "",
          is_published: false,
          closes_at: "",
        },
  });

  const onSubmit = async (values: JobInput) => {
    const result = await upsertJob(values);
    if (result.success) {
      toast.success(job ? "Job updated." : "Job created.");
      router.push("/admin/jobs");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <section className="space-y-5 border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="job-title">Job title</Label>
              <Input
                id="job-title"
                className="mt-2 rounded-none"
                {...register("title")}
                onBlur={() => {
                  if (!job && !getValues("slug")) {
                    setValue("slug", slugify(getValues("title")));
                  }
                }}
              />
              <FieldError message={errors.title?.message} />
            </div>
            <div>
              <Label htmlFor="job-slug">URL slug</Label>
              <Input id="job-slug" className="mt-2 rounded-none font-mono" {...register("slug")} />
              <FieldError message={errors.slug?.message} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="job-ref">Job reference</Label>
              <Input
                id="job-ref"
                placeholder="SLL-1044"
                className="mt-2 rounded-none font-mono"
                {...register("reference")}
              />
              <FieldError message={errors.reference?.message} />
            </div>
            <div>
              <Label>Division</Label>
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-2 w-full rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Contract type</Label>
              <Controller
                control={control}
                name="job_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-2 w-full rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="job-location">Location</Label>
              <Input id="job-location" className="mt-2 rounded-none" {...register("location")} />
              <FieldError message={errors.location?.message} />
            </div>
            <div>
              <Label htmlFor="job-industry">Industry</Label>
              <Input
                id="job-industry"
                placeholder="e.g. Warehousing"
                className="mt-2 rounded-none"
                {...register("industry")}
              />
              <FieldError message={errors.industry?.message} />
            </div>
            <div>
              <Label htmlFor="job-salary">
                Salary <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="job-salary"
                placeholder="£13.20 per hour"
                className="mt-2 rounded-none"
                {...register("salary_text")}
              />
              <FieldError message={errors.salary_text?.message} />
            </div>
          </div>
          <div>
            <Label htmlFor="job-summary">Summary (card text)</Label>
            <Textarea id="job-summary" rows={2} className="mt-2 rounded-none" {...register("summary")} />
            <FieldError message={errors.summary?.message} />
          </div>
          <div>
            <Label>Full description</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="body_html"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="The role, requirements and what you'll get…"
                  />
                )}
              />
            </div>
            <FieldError message={errors.body_html?.message} />
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Publishing</h2>
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                <Label htmlFor="job-published" className="cursor-pointer">
                  Live on the job board
                </Label>
                <Switch id="job-published" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          <div>
            <Label htmlFor="job-closes">
              Closing date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="job-closes" type="date" className="mt-2 rounded-none" {...register("closes_at")} />
            <FieldError message={errors.closes_at?.message} />
          </div>
        </section>

        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Application routing</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Leave blank to fall back to the global applications email and the default
            instruction template from Settings.
          </p>
          <div>
            <Label htmlFor="job-app-email">
              Application email <span className="text-muted-foreground">(override)</span>
            </Label>
            <Input
              id="job-app-email"
              type="email"
              className="mt-2 rounded-none"
              {...register("application_email")}
            />
            <FieldError message={errors.application_email?.message} />
          </div>
          <div>
            <Label htmlFor="job-app-instructions">
              Application instructions <span className="text-muted-foreground">(override)</span>
            </Label>
            <Textarea
              id="job-app-instructions"
              rows={4}
              placeholder={`Please quote Job ID [reference] and send your CV to…`}
              className="mt-2 rounded-none"
              {...register("application_instructions")}
            />
            <FieldError message={errors.application_instructions?.message} />
          </div>
        </section>

        <Button type="submit" size="lg" className="w-full gap-2 rounded-none" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {isSubmitting ? "Saving…" : job ? "Save changes" : "Create job listing"}
        </Button>
      </div>
    </form>
  );
}
