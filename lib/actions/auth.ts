"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import {
  changeEmailSchema,
  changePasswordSchema,
  loginSchema,
  type ChangeEmailInput,
  type ChangePasswordInput,
  type LoginInput,
} from "@/lib/validations";

export interface AuthResult {
  error: string;
}

export type AccountResult = { success: true; message: string } | { success: false; error: string };

export async function signIn(input: LoginInput, next?: string): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Changes the signed-in admin's password. */
export async function changePassword(input: ChangePasswordInput): Promise<AccountResult> {
  try {
    const parsed = changePasswordSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid password" };
    }
    const { supabase } = await requireAdmin();
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) {
      // Supabase rejects reusing the current password, weak passwords, etc.
      return { success: false, error: error.message };
    }
    return { success: true, message: "Password updated. Use it on your next sign-in." };
  } catch {
    return { success: false, error: "Your session has expired — please sign in again." };
  }
}

/**
 * Changes the signed-in admin's email. Supabase sends confirmation links
 * to both the old and new address; the change applies once confirmed.
 */
export async function changeEmail(input: ChangeEmailInput): Promise<AccountResult> {
  try {
    const parsed = changeEmailSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
    }
    const { supabase } = await requireAdmin();
    const { error } = await supabase.auth.updateUser({ email: parsed.data.email });
    if (error) {
      return { success: false, error: error.message };
    }
    return {
      success: true,
      message:
        "Confirmation links sent to your current and new email address. The change applies once both are confirmed.",
    };
  } catch {
    return { success: false, error: "Your session has expired — please sign in again." };
  }
}
