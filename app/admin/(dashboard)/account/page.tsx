import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ChangeEmailForm, ChangePasswordForm } from "@/components/admin/account-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <AdminPageHeader
        title="Account"
        description="Your admin sign-in credentials. Changes apply to your account only."
      />

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <section className="border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center border border-border bg-background">
              <UserRound className="size-5 text-muted-foreground" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Signed in as
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            {user.last_sign_in_at ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Last sign-in</dt>
                <dd className="font-mono text-[0.8125rem] text-foreground">
                  {formatDateTime(user.last_sign_in_at)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Account created</dt>
              <dd className="font-mono text-[0.8125rem] text-foreground">
                {formatDateTime(user.created_at)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="font-display text-base font-semibold text-foreground">
              Change sign-in email
            </h3>
            <div className="mt-4">
              <ChangeEmailForm currentEmail={user.email ?? ""} />
            </div>
          </div>
        </section>

        <section className="border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Change password
          </h2>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
          <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            Need another administrator? Add users in the Supabase dashboard under
            Authentication → Users — any confirmed user can sign in to this portal, so
            keep public sign-ups disabled.
          </p>
        </section>
      </div>
    </>
  );
}
