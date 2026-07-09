"use client";

import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { upsertService } from "@/lib/actions/admin";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { Division, ServiceRow } from "@/lib/types";

interface ServiceFormProps {
  division: Division;
  service?: ServiceRow;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function ServiceForm({ division, service }: ServiceFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          id: service.id,
          division: service.division,
          slug: service.slug,
          title: service.title,
          excerpt: service.excerpt,
          body_html: service.body_html,
          benefits: service.benefits,
          faqs: service.faqs,
          icon: service.icon ?? "",
          meta_title: service.meta_title ?? "",
          meta_description: service.meta_description ?? "",
          is_published: service.is_published,
          sort_order: service.sort_order,
        }
      : {
          division,
          slug: "",
          title: "",
          excerpt: "",
          body_html: "",
          benefits: [],
          faqs: [],
          icon: "",
          meta_title: "",
          meta_description: "",
          is_published: false,
          sort_order: 0,
        },
  });

  const benefits = useFieldArray({ control, name: "benefits" });
  const faqs = useFieldArray({ control, name: "faqs" });

  const onSubmit = async (values: ServiceInput) => {
    const result = await upsertService(values);
    if (result.success) {
      toast.success(service ? "Service updated." : "Service created.");
      router.push(`/admin/services/${division}`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 xl:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 xl:col-span-2">
        <section className="space-y-5 border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="svc-title">Title</Label>
              <Input
                id="svc-title"
                className="mt-2 rounded-none"
                {...register("title", {
                  onChange: (e) => {
                    if (!service && !getValues("slug")) return;
                    if (!service) {
                      setValue("slug", slugify(e.target.value));
                    }
                  },
                })}
                onBlur={() => {
                  if (!service && !getValues("slug")) {
                    setValue("slug", slugify(getValues("title")));
                  }
                }}
              />
              <FieldError message={errors.title?.message} />
            </div>
            <div>
              <Label htmlFor="svc-slug">URL slug</Label>
              <Input id="svc-slug" className="mt-2 rounded-none font-mono" {...register("slug")} />
              <FieldError message={errors.slug?.message} />
            </div>
          </div>
          <div>
            <Label htmlFor="svc-excerpt">Excerpt (listing cards &amp; meta fallback)</Label>
            <Textarea id="svc-excerpt" rows={3} className="mt-2 rounded-none" {...register("excerpt")} />
            <FieldError message={errors.excerpt?.message} />
          </div>
          <div>
            <Label>Service description</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="body_html"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe the service, how it works and who it's for…"
                  />
                )}
              />
            </div>
            <FieldError message={errors.body_html?.message} />
          </div>
        </section>

        {/* Benefits */}
        <section className="border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Benefits</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-none"
              onClick={() => benefits.append({ title: "", description: "" })}
            >
              <Plus className="size-3.5" /> Add benefit
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {benefits.fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Benefits appear as the numbered rail beside the service description.
              </p>
            ) : null}
            {benefits.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`benefit-title-${index}`}>Benefit title</Label>
                    <Input
                      id={`benefit-title-${index}`}
                      className="mt-2 rounded-none"
                      {...register(`benefits.${index}.title`)}
                    />
                    <FieldError message={errors.benefits?.[index]?.title?.message} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => benefits.remove(index)}
                    aria-label="Remove benefit"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`benefit-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`benefit-desc-${index}`}
                    rows={2}
                    className="mt-2 rounded-none"
                    {...register(`benefits.${index}.description`)}
                  />
                  <FieldError message={errors.benefits?.[index]?.description?.message} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">FAQs</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-none"
              onClick={() => faqs.append({ question: "", answer: "" })}
            >
              <Plus className="size-3.5" /> Add FAQ
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {faqs.fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                FAQs render on the service page and emit FAQPage structured data for search.
              </p>
            ) : null}
            {faqs.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`faq-q-${index}`}>Question</Label>
                    <Input
                      id={`faq-q-${index}`}
                      className="mt-2 rounded-none"
                      {...register(`faqs.${index}.question`)}
                    />
                    <FieldError message={errors.faqs?.[index]?.question?.message} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => faqs.remove(index)}
                    aria-label="Remove FAQ"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                  <Textarea
                    id={`faq-a-${index}`}
                    rows={3}
                    className="mt-2 rounded-none"
                    {...register(`faqs.${index}.answer`)}
                  />
                  <FieldError message={errors.faqs?.[index]?.answer?.message} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Publishing</h2>
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                <Label htmlFor="svc-published" className="cursor-pointer">
                  Published
                </Label>
                <Switch
                  id="svc-published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
          <div>
            <Label htmlFor="svc-sort">Sort order</Label>
            <Input
              id="svc-sort"
              type="number"
              min={0}
              className="mt-2 rounded-none"
              {...register("sort_order", { valueAsNumber: true })}
            />
            <FieldError message={errors.sort_order?.message} />
          </div>
          <div>
            <Label htmlFor="svc-icon">
              Icon name <span className="text-muted-foreground">(lucide, optional)</span>
            </Label>
            <Input
              id="svc-icon"
              placeholder="e.g. truck"
              className="mt-2 rounded-none font-mono"
              {...register("icon")}
            />
            <FieldError message={errors.icon?.message} />
          </div>
        </section>

        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">SEO</h2>
          <div>
            <Label htmlFor="svc-meta-title">Meta title</Label>
            <Input id="svc-meta-title" className="mt-2 rounded-none" {...register("meta_title")} />
            <FieldError message={errors.meta_title?.message} />
          </div>
          <div>
            <Label htmlFor="svc-meta-desc">Meta description</Label>
            <Textarea
              id="svc-meta-desc"
              rows={3}
              className="mt-2 rounded-none"
              {...register("meta_description")}
            />
            <FieldError message={errors.meta_description?.message} />
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          className="w-full gap-2 rounded-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {isSubmitting ? "Saving…" : service ? "Save changes" : "Create service"}
        </Button>
      </div>
    </form>
  );
}
