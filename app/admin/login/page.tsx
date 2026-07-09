import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-deeper px-4">
      <div className="texture-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 right-[10%] h-96 w-96 rounded-full bg-freight/10 blur-3xl"
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper p-2">
            <Image
              src="/log_without_name.png"
              alt=""
              width={52}
              height={52}
              className="size-12 object-contain"
              priority
            />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-paper">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-paper/60">
            Content management &amp; lead tracking for Simple Logistics Limited
          </p>
        </div>
        <div className="border border-paper/10 bg-background p-8 shadow-2xl">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
