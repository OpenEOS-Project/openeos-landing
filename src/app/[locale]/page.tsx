import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Pricing, type PricingData } from "@/components/sections/Pricing";
import { OpenSource } from "@/components/sections/OpenSource";
import { CTA } from "@/components/sections/CTA";

async function fetchPricingData(): Promise<PricingData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/api/pricing`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pricingData = await fetchPricingData();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing pricingData={pricingData} />
        <OpenSource />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
