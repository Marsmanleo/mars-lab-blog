import type { Metadata, ResolvingMetadata, Viewport } from "next";
import React, { ReactNode } from "react";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { i18n } from "../../../i18n-config";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";


async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "notificationBanner.link",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

type MetadataProps = {
  params: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const meta = await getGlobal(params.lang);

    if (meta.data) {
      const { metadata, favicon } = meta.data.attributes;
      const { url } = favicon.data.attributes;
      const faviconUrl = getStrapiMedia(url) || "/favicon.ico";

      return {
        title: metadata.metaTitle,
        description: metadata.metaDescription || "Default description",
        icons: {
          icon: [faviconUrl],
        },
        metadataBase: new URL(getStrapiURL()),
        charset: 'utf-8',
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  // Fallback metadata with required fields for when API data is unavailable
  return {
    ...FALLBACK_SEO,
    metadataBase: new URL(getStrapiURL()),
    charset: 'utf-8',
  };
}

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

type RootLayoutProps = {
  children: ReactNode;
  params: { lang: string };
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps): Promise<JSX.Element> {
  let notificationBanner = null;
  let navbar = null;
  let footer = null;
  let navbarLogoUrl = "";
  let footerLogoUrl = "";
  let hasError = false;
  
  try {
    const global = await getGlobal(params.lang);
    
    if (global.data) {
      const globalAttributes = global.data.attributes;
      notificationBanner = globalAttributes.notificationBanner;
      navbar = globalAttributes.navbar;
      footer = globalAttributes.footer;
      
      navbarLogoUrl = getStrapiMedia(
        navbar.navbarLogo.logoImg.data?.attributes.url
      );
      
      footerLogoUrl = getStrapiMedia(
        footer.footerLogo.logoImg.data?.attributes.url
      );
    } else {
      hasError = true;
    }
  } catch (error) {
    console.error("Failed to load global data:", error);
    hasError = true;
  }
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {hasError ? (
          <>
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center p-8">
                <h1 className="text-4xl font-bold mb-4">Error Loading Page</h1>
                <p className="mb-6">Sorry, we couldn't load the global content for this page.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <Navbar
              links={navbar?.links || []}
              logoUrl={navbarLogoUrl}
              logoText={navbar?.navbarLogo?.logoText || ""}
            />
  
            <main className="min-h-screen dark:bg-black dark:text-gray-100">
              {children}
            </main>
  
            <Banner data={notificationBanner} />
  
            <Footer
              logoUrl={footerLogoUrl}
              logoText={footer?.footerLogo?.logoText || ""}
              menuLinks={footer?.menuLinks || []}
              categoryLinks={footer?.categories?.data || []}
              legalLinks={footer?.legalLinks || []}
              socialLinks={footer?.socialLinks || []}
            />
          </>
        )}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
