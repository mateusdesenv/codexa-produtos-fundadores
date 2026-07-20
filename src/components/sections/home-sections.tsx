"use client";

import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useContact } from "@/components/ui/contact-dialog";

const founders = [
  {
    name: "Mateus",
    role: "Produto & Estratégia",
    bio: "Estratégia, experiência e visão de produto para transformar problemas reais em soluções digitais simples e úteis.",
    image: "/assets/codexa/homepage-products/founders/mateus.png",
    position: "center center",
  },
  {
    name: "Anderson",
    role: "Tecnologia & Operações",
    bio: "Engenharia de software, arquitetura escalável e execução técnica para construir produtos sólidos e eficientes.",
    image: "/assets/codexa/homepage-products/founders/anderson.jpeg",
    position: "center 28%",
  },
];

const principles = [
  {
    Icon: Sparkles,
    title: "Clareza antes da complexidade",
    text: "Cada decisão de produto começa pelo problema, pelas pessoas e pelo resultado que precisa ser alcançado.",
  },
  {
    Icon: ShieldCheck,
    title: "Tecnologia com responsabilidade",
    text: "Segurança, acessibilidade e desempenho fazem parte da solução desde a primeira versão.",
  },
  {
    Icon: Layers3,
    title: "Produtos que evoluem",
    text: "Criamos fundações consistentes para aprender, iterar e escalar sem perder simplicidade.",
  },
];

const portfolio = [
  { Icon: BrainCircuit, name: "Brainlink", text: "Memória e contexto para agentes de IA." },
  { Icon: Layers3, name: "Vitrinefolio", text: "Portfólios profissionais que vendem o trabalho." },
  { Icon: Code2, name: "Minuta AI", text: "Automação inteligente de documentos jurídicos." },
  { Icon: ShieldCheck, name: "Gestão Paroquial", text: "Operação financeira centralizada para paróquias." },
];

export function FoundersSection() {
  return (
    <section id="fundadores" className="site-section site-section--alternate scroll-mt-20" aria-labelledby="founders-title">
      <div className="section-shell">
        <header className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
          <p className="section-eyebrow">Fundadores</p>
          <h2 id="founders-title" className="section-title">Experiência real.<br />Visão de produto.</h2>
          </div>
          <p className="section-copy lg:mb-1">
            Unimos estratégia e tecnologia para criar produtos que fazem a diferença.
          </p>
        </header>

        <div className="mt-12 space-y-6 lg:mt-14 lg:space-y-8">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className={`founder-card surface-card grid overflow-hidden rounded-[1.5rem] ${
                index === 0 ? "md:grid-cols-[58%_42%]" : "md:grid-cols-[42%_58%]"
              }`}
            >
              <div
                className={`relative min-h-72 sm:min-h-80 md:min-h-[420px] ${
                  index === 0 ? "md:order-2" : "md:order-1"
                }`}
              >
                <Image
                  src={founder.image}
                  alt={`Foto de ${founder.name}, fundador da Codexa`}
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: founder.position }}
                />
              </div>

              <div
                className={`relative flex flex-col justify-center p-7 sm:p-10 lg:p-14 ${
                  index === 0 ? "md:order-1" : "md:order-2"
                }`}
              >
                <span className="absolute left-7 top-7 h-px w-10 bg-green sm:left-10 sm:top-10 lg:left-14 lg:top-12" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-strong">
                  Cofundador · 0{index + 1}
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {founder.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-green-strong">{founder.role}</p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">{founder.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  return (
    <section id="depoimentos" className="site-section scroll-mt-20" aria-labelledby="principles-title">
      <div className="section-shell">
        <header className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow justify-center">Como construímos</p>
          <h2 id="principles-title" className="mt-4 text-3xl font-semibold tracking-[-.035em] text-white sm:text-5xl">Confiança nasce do processo.</h2>
          <p className="mt-5 leading-7 text-slate-400">Princípios simples orientam cada escolha — do primeiro rascunho à evolução contínua do produto.</p>
        </header>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {principles.map(({ Icon, title, text }, index) => (
            <article key={title} className="surface-card rounded-[1.5rem] p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-green/10 text-green"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="text-xs font-medium text-white/30">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section id="portfolio" className="site-section site-section--alternate scroll-mt-20" aria-labelledby="portfolio-title">
      <div className="section-shell">
        <header className="text-center">
          <p className="section-eyebrow justify-center">Portfólio</p>
          <h2 id="portfolio-title" className="mt-4 text-3xl font-semibold tracking-[-.035em] text-white sm:text-5xl">Um ecossistema em movimento.</h2>
        </header>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.map(({ Icon, name, text }) => (
            <article key={name} className="bg-[#0a141c] p-7 transition-colors hover:bg-[#0d1922]">
              <Icon className="h-6 w-6 text-green" aria-hidden="true" />
              <h3 className="mt-7 font-semibold text-white">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCta() {
  const { open } = useContact();
  return (
    <section id="contato" className="contact-cta scroll-mt-20" aria-labelledby="contact-cta-title">
      <div className="section-shell flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="section-eyebrow">Próximo capítulo</p>
          <h2 id="contact-cta-title" className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-white sm:text-6xl">
            Uma boa ideia merece<br />virar um <span className="text-green">ótimo produto.</span>
          </h2>
          <p className="mt-5 text-slate-300">Conte o desafio. A gente pensa o próximo passo com você.</p>
        </div>
        <button type="button" onClick={() => open()} className="button-primary">
          Iniciar uma conversa <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
