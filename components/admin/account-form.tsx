"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeEmail, changePassword } from "@/lib/actions/auth";
import {
  changeEmailSchema,
  changePasswordSchema,
  type ChangeEmailInput,
  type ChangePasswordInput,
} from "@/lib/validations";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (values: ChangePasswordInput) => {
    const result = await changePassword(values);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="acc-password">New password</Label>
        <Input
          id="acc-password"
          type="password"
          autoComplete="new-password"
          className="mt-2 rounded-none"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          At least 10 characters with an uppercase letter, a lowercase letter and a number.
        </p>
      </div>
      <div>
        <Label htmlFor="acc-confirm">Confirm new password</Label>
        <Input
          id="acc-confirm"
          type="password"
          autoComplete="new-password"
          className="mt-2 rounded-none"
          {...register("confirm")}
        />
        <FieldError message={errors.confirm?.message} />
      </div>
      <Button type="submit" className="gap-2 rounded-none" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <KeyRound className="size-4" aria-hidden />
        )}
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ChangeEmailInput) => {
    if (values.email.toLowerCase() === currentEmail.toLowerCase()) {
      toast.error("That is already your sign-in email.");
      return;
    }
    const result = await changeEmail(values);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="acc-email">New sign-in email</Label>
        <Input
          id="acc-email"
          type="email"
          autoComplete="email"
          placeholder={currentEmail}
          className="mt-2 rounded-none"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Confirmation links are sent to both your current and new address — the change
          applies once confirmed.
        </p>
      </div>
      <Button type="submit" variant="outline" className="gap-2 rounded-none" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <MailPlus className="size-4" aria-hidden />
        )}
        {isSubmitting ? "Sending…" : "Change email"}
      </Button>
    </form>
  );
}
