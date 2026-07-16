import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products-section";
import {
  ContactCta,
  FoundersSection,
  PortfolioSection,
  PrinciplesSection,
} from "@/components/sections/home-sections";
import { SiteFooter } from "@/components/sections/site-footer";

export default function HomePage() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProductsSection />
        <FoundersSection />
        <PrinciplesSection />
        <PortfolioSection />
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}
