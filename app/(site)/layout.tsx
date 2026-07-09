import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getSettings } from "@/lib/queries";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <SiteHeader
        siteName={settings.site_name}
        logoUrl={settings.logo_url}
        phone={settings.phone}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
