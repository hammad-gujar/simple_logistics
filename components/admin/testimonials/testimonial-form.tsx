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
import { upsertTestimonial } from "@/lib/actions/admin";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";
import type { TestimonialRow } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function TestimonialForm({ testimonial }: { testimonial?: TestimonialRow }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial
      ? {
          id: testimonial.id,
          quote: testimonial.quote,
          author_name: testimonial.author_name,
          author_role: testimonial.author_role,
          division: testimonial.division,
          sort_order: testimonial.sort_order,
          is_published: testimonial.is_published,
        }
      : {
          quote: "",
          author_name: "",
          author_role: "",
          division: null,
          sort_order: 0,
          is_published: true,
        },
  });

  const onSubmit = async (values: TestimonialInput) => {
    const result = await upsertTestimonial(values);
    if (result.success) {
      toast.success(testimonial ? "Testimonial updated." : "Testimonial created.");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-2xl space-y-5 border border-border bg-card p-6"
    >
      <div>
        <Label htmlFor="t-quote">Quote</Label>
        <Textarea id="t-quote" rows={4} className="mt-2 rounded-none" {...register("quote")} />
        <FieldError message={errors.quote?.message} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="t-author">Author name</Label>
          <Input id="t-author" className="mt-2 rounded-none" {...register("author_name")} />
          <FieldError message={errors.author_name?.message} />
        </div>
        <div>
          <Label htmlFor="t-role">Role &amp; organisation</Label>
          <Input
            id="t-role"
            placeholder="Transport Manager, Regional Haulier"
            className="mt-2 rounded-none"
            {...register("author_role")}
          />
          <FieldError message={errors.author_role?.message} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>Division</Label>
          <Controller
            control={control}
            name="division"
            render={({ field }) => (
              <Select
                value={field.value ?? "none"}
                onValueChange={(v) => field.onChange(v === "none" ? null : v)}
              >
                <SelectTrigger className="mt-2 w-full rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor="t-sort">Sort order</Label>
          <Input
            id="t-sort"
            type="number"
            min={0}
            className="mt-2 rounded-none"
            {...register("sort_order", { valueAsNumber: true })}
          />
          <FieldError message={errors.sort_order?.message} />
        </div>
      </div>
      <Controller
        control={control}
        name="is_published"
        render={({ field }) => (
          <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
            <Label htmlFor="t-published" className="cursor-pointer">
              Visible on the site
            </Label>
            <Switch id="t-published" checked={field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />
      <Button type="submit" className="w-full gap-2 rounded-none" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Save className="size-4" aria-hidden />
        )}
        {isSubmitting ? "Saving…" : testimonial ? "Save changes" : "Create testimonial"}
      </Button>
    </form>
  );
}
