"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField, useAntiBot } from "@/components/site/anti-bot";
import { submitContactInquiry } from "@/lib/actions/public";
import { contactSchema, type ContactInput } from "@/lib/validations";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { honeypotRef, getAntiBotValues } = useAntiBot();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    const result = await submitContactInquiry(values, getAntiBotValues());
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error);
    }
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-border bg-card p-12 text-center">
        <CheckCircle2 className="size-10 text-care" aria-hidden />
        <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
          Message received.
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you for getting in touch — a member of the team will reply within one
          working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-5 border border-border bg-card p-7 sm:p-9"
      noValidate
    >
      <HoneypotField inputRef={honeypotRef} id="contact-website" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Full name</Label>
          <Input
            id="contact-name"
            className="mt-2 rounded-none"
            autoComplete="name"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="contact-email">Email address</Label>
          <Input
            id="contact-email"
            type="email"
            className="mt-2 rounded-none"
            autoComplete="email"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            className="mt-2 rounded-none"
            autoComplete="tel"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="contact-subject">Subject</Label>
          <Input id="contact-subject" className="mt-2 rounded-none" {...register("subject")} />
          <FieldError message={errors.subject?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message">How can we help?</Label>
        <Textarea
          id="contact-message"
          rows={6}
          className="mt-2 rounded-none"
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" size="lg" className="w-full gap-2 rounded-none" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
