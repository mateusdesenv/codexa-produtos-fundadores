import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { HeroParticleOrb } from "@/components/sections/hero-particle-orb";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { getPortfolioItems, type PortfolioItem } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Conheça os projetos, produtos e experiências digitais criados pela Codexa.",
};

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let unavailable = false;

  try {
    items = await getPortfolioItems();
  } catch {
    unavailable = true;
  }

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="portfolio-page flex-1" tabIndex={-1}>
        <section className="portfolio-hero" aria-labelledby="portfolio-page-title">
          <HeroParticleOrb logoScale={0.7} scrollEffects={false} />
          <div className="section-shell relative z-10">
            <Link href="/" className="portfolio-back">
              Codexa / Portfólio
            </Link>
            <p className="section-eyebrow mt-10">Projetos selecionados</p>
            <h1 id="portfolio-page-title">
              Ideias que viraram
              <br />
              <span>experiências reais.</span>
            </h1>
            <p>
              Produtos, plataformas e páginas construídas com estratégia,
              tecnologia e atenção aos detalhes.
            </p>
          </div>
        </section>

        <section className="portfolio-listing" aria-label="Projetos da Codexa">
          <div className="section-shell">
            {unavailable ? (
              <div className="portfolio-empty">
                <h2>O portfólio está temporariamente indisponível.</h2>
                <p>Tente novamente em alguns instantes.</p>
              </div>
            ) : (
              <PortfolioGallery items={items} />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
