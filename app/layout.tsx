import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.meta_title ?? settings.site_name;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.meta_description ?? settings.tagline ?? undefined,
    applicationName: settings.site_name,
    // Brand mark ships as the favicon until the admin sets a custom one.
    icons: { icon: settings.favicon_url ?? "/log_without_name.png" },
    openGraph: {
      siteName: settings.site_name,
      locale: "en_GB",
      type: "website",
      images: settings.og_image_url
        ? [{ url: settings.og_image_url, width: 1200, height: 630 }]
        : [{ url: "/logo_with_name.png", width: 500, height: 500 }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
