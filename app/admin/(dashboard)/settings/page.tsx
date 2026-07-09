import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <AdminPageHeader
        title="Global settings"
        description="The single source of truth for business details — nothing on the public site is hardcoded. Saving revalidates every page."
      />
      <SettingsForm settings={mergeSettings(data)} />
    </>
  );
}
